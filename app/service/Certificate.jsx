import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '../src/context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Global } from '../style/Global';

const Certificate = ({ navigation }) => {
  const { currentUser } = useAuth();

  const [certificateImage, setCertificateImage] = useState(null);
  const [certificateDetails, setCertificateDetails] = useState({
    title: '',
    description: '',
  });

  const handleChooseImage = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        setCertificateImage(image);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadCertificate = async () => {
    try {
      if (!certificateDetails.title || !certificateDetails.description) {
        showMessage({
          message: 'Please fill in all fields.',
          type: 'warning',
        });
        return;
      }
  
      if (!certificateImage) {
        showMessage({
          message: 'Please select an image.',
          type: 'warning',
        });
        return;
      }
  
      let certificateImageUrl = '';
  
      // Upload the certificate image
      const imageRef = storage().ref(`docs/${currentUser.uid}/Certificates/${certificateDetails.title}`);
      const imageResponse = await imageRef.putFile(certificateImage.path);
  
      if (imageResponse.state === 'success') {
        certificateImageUrl = await imageRef.getDownloadURL();
      } else {
        showMessage({
          message: 'Error uploading the certificate image.',
          type: 'danger',
        });
        return;
      }
  
      // Create a certificate object
      const certificateData = {
        ...certificateDetails,
        imageUrl: certificateImageUrl,
      };
  
      // Store data in Firestore
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('certificates')
        .add(certificateData);
  
      showMessage({
        message: 'Certificate uploaded successfully.',
        type: 'success',
      });
      navigation.navigate('Profile'); // Navigate to the Profile or any other screen as needed
      resetForm();
    } catch (error) {
      showMessage({
        message: 'An error occurred while uploading the certificate.',
        type: 'danger',
      });
      console.error(error);
    }
  };
  

  const resetForm = () => {
    setCertificateImage(null);
    setCertificateDetails({ title: '', description: '' });
  };

  const handleInputChange = (field, value) => {
    setCertificateDetails({
      ...certificateDetails,
      [field]: value,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={Global.title}>Certificate Upload</Text>

          <TouchableOpacity
            onPress={handleChooseImage}
            style={styles.imageContainer}
          >
            {certificateImage ? (
              <Image source={{ uri: certificateImage.path }} style={styles.image} />
            ) : (
              <Text style={styles.placeholderText}>Select Certificate Image</Text>
            )}
          </TouchableOpacity>

          <TextInput
            style={Global.input}
            placeholder="Certificate Title"
            onChangeText={(text) => handleInputChange('title', text)}
            value={certificateDetails.title}
          />
          <TextInput
            style={Global.input}
            placeholder="Description"
            onChangeText={(text) => handleInputChange('description', text)}
            value={certificateDetails.description}
          />
          <View>
          <Button title="Upload Certificate" onPress={uploadCertificate} />
          <Button title='Skip' onPress={() => navigation.navigate('Complete')} />
          <Button title="Go Back" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Certificate;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 30,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',  
    justifyContent: 'center', 
    gap: 20,
  },
});
