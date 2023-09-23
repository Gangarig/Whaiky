import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const Test = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [multipleImages, setMultipleImages] = useState([]);
    const [width, setWidth] = useState(350);
    const [height, setHeight] = useState(500);

    const selectImageFromGallery = async (width, height) => {
        try {
            const image = await ImagePicker.openPicker({
                width,
                height,
                cropping: true,
            });
            return image.path;
        } catch (error) {
            throw error;
        }
    };

    const takePhotoWithCamera = async (width, height) => {
        try {
            const image = await ImagePicker.openCamera({
                width,
                height,
                cropping: true,
            });
            return image.path;
        } catch (error) {
            throw error;
        }
    };

    const selectMultipleImagesFromGallery = async (width, height) => {
        try {
            const images = await ImagePicker.openPicker({
                width,
                height,
                cropping: true,
                multiple: true,
            });
            return images.map(img => img.path);
        } catch (error) {
            throw error;
        }
    };

    const handleCropImage = async () => {
        try {
            const croppedImage = await ImagePicker.openCropper({
                path: selectedImage,
                width,
                height,
            });
            setSelectedImage(croppedImage.path);
        } catch (error) {
            console.log(error);
        }
    };

    const handleMultipleImagePicker = async () => {
        try {
            const imagePaths = await selectMultipleImagesFromGallery(width, height);
            setMultipleImages(imagePaths);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            {selectedImage && <Image source={{ uri: selectedImage }} style={{width: width, height: height, alignSelf: 'center', marginVertical: 20}} />}

            {multipleImages.map((imagePath, index) => (
                <Image key={index} source={{ uri: imagePath }} style={{width: width/2, height: height/2, alignSelf: 'center', marginVertical: 10}} />
            ))}

            <View style={{ marginTop: 20 }}>
                <Button title="Choose from Gallery" onPress={() => selectImageFromGallery(width, height).then(setSelectedImage).catch(console.log)} />
            </View>
            <View style={{ marginTop: 20 }}>
                <Button title="Take a Photo" onPress={() => takePhotoWithCamera(width, height).then(setSelectedImage).catch(console.log)} />
            </View>
            <View style={{ marginTop: 20 }}>
                <Button title="Select Multiple Images" onPress={handleMultipleImagePicker} />
            </View>
            {selectedImage && (
                <View style={{ marginTop: 20 }}>
                    <Button title="Crop Image" onPress={handleCropImage} />
                </View>
            )}
        </ScrollView>
    );
};

export default Test;
