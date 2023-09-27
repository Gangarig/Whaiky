import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';

const AddPost = ({ navigation }) => {
    const { currentUser } = useAuth();

    const [postDetails, setPostDetails] = useState({
        title: '',
        description: '',
        price: '',
        location: {
            country: '',
            state: '',
            city: ''
        },
        category: {
            categoryId: '',
            categoryText: '',
            optionId: '',
            optionText: ''
        },
        images: [],
        postType: 'lookingForService',
        postId: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);


    const updatePostDetail = (key, value) => {
        setPostDetails(prevState => ({ ...prevState, [key]: value }));
    };

    const takePhoto = async () => {
        const image = await ImagePicker.openCamera({ width: 300, height: 400, cropping: true });
        setPostDetails(prevState => ({ ...prevState, images: [...prevState.images, image.path] }));
    };

    const selectPhoto = async () => {
        const images = await ImagePicker.openPicker({
            multiple: true,
            maxFiles: 3 - postDetails.images.length
        });
        setPostDetails(prevState => ({ ...prevState, images: [...prevState.images, ...images.map(img => img.path)] }));
    };

    const handlePost = async () => {
        try {
            const docRef = await firestore().collection('posts').add({
                ...postDetails,
                createdAt: firestore.FieldValue.serverTimestamp(),
                ownerAvatar: currentUser.photoURL,
                ownerName: currentUser.displayName,
                ownerId: currentUser.uid
            });
    
            setPostDetails(prevState => ({ ...prevState, postId: docRef.id }));
    
            const uploadedImages = [];
            for (let i = 0; i < postDetails.images.length; i++) {
                const imageName = `${currentUser.uid}_${Date.now()}_${i}`; 

                const task = storage().ref(`post_images/${docRef.id}/${imageName}`).putFile(postDetails.images[i]);

                task.on('state_changed', snapshot => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });

                await task;

                const url = await storage().ref(`post_images/${docRef.id}/${imageName}`).getDownloadURL();
                uploadedImages.push(url);
            }
    
            await docRef.update({ images: uploadedImages });
    
            setSuccess('Post created successfully!');
            setPostDetails({
                title: '',
                description: '',
                price: '',
                location: {
                    country: '',
                    state: '',
                    city: ''
                },
                category: {
                    categoryId: '',
                    categoryText: '',
                    optionId: '',
                    optionText: ''
                },
                images: [],
                postType: 'lookingForService',
                postId: ''
            });
            navigation.goBack();
        } catch (error) {
            setError('Error creating post: ' + error.message);
        }
    };
    

    return (
        <SafeAreaView style={styles.container}>
            {error && <Text style={{color: 'red', alignSelf: 'center', margin: 5}}>{error}</Text>}
            {success && <Text style={{color: 'green', alignSelf: 'center', margin: 5}}>{success}</Text>}
            <ScrollView>
                <View style={styles.section}>
                    <Text style={styles.label}>Post Type</Text>
                    <Button title={postDetails.postType} onPress={() => updatePostDetail('postType', postDetails.postType === 'lookingForService' ? 'providingService' : 'lookingForService')} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.input} placeholder="Title" value={postDetails.title} onChangeText={(text) => updatePostDetail('title', text)} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.input} placeholder="Description" value={postDetails.description} onChangeText={(text) => updatePostDetail('description', text)} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput style={styles.input} placeholder="Price" value={postDetails.price} onChangeText={(text) => updatePostDetail('price', text)} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Country</Text>
                    <TextInput style={styles.input} placeholder="Country" value={postDetails.location.country} onChangeText={(text) => updatePostDetail('location', {...postDetails.location, country: text})} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>State</Text>
                    <TextInput style={styles.input} placeholder="State" value={postDetails.location.state} onChangeText={(text) => updatePostDetail('location', {...postDetails.location, state: text})} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>City</Text>
                    <TextInput style={styles.input} placeholder="City" value={postDetails.location.city} onChangeText={(text) => updatePostDetail('location', {...postDetails.location, city: text})} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Category</Text>
                    <TextInput style={styles.input} placeholder="Category" value={postDetails.category.categoryText} onChangeText={(text) => updatePostDetail('category', {...postDetails.category, categoryText: text})} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Option</Text>
                    <TextInput style={styles.input} placeholder="Option" value={postDetails.category.optionText} onChangeText={(text) => updatePostDetail('category', {...postDetails.category, optionText: text})} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Image</Text>
                    <View style={{ height: 10, width: '100%', backgroundColor: '#E0E0E0', marginBottom: 10 }}>
                        <View style={{ height: '100%', width: `${uploadProgress}%`, backgroundColor: 'green' }} />
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                        {postDetails.images.map((image, index) => (
                            <Image key={index} source={{ uri: image }} style={styles.selectedImage} />
                        ))}
                    </ScrollView>
                    <Button title="Take Photo" onPress={takePhoto} />
                    <Button title="Select Photos" onPress={selectPhoto} />
                    <Button title="Back"onPress={() => navigation.goBack()} />
                </View>

                <Button title="Submit" onPress={handlePost} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    section: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d1d1',
        padding: 10,
        borderRadius: 4,
    },
    imagesContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    selectedImage: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10,
    },
});

export default AddPost;
