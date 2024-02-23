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
import { useAuth } from '../../../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Global } from '../../../../constant/Global';
import LinearGradient from 'react-native-linear-gradient';
import { shadowStyle } from '../../../../constant/Shadow';
import { useTheme } from '../../../../context/ThemeContext';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';


const Certificate = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [certificateImage, setCertificateImage] = useState(null);
  const [certificateDetails, setCertificateDetails] = useState({
    title: '',
    description: '',
    typeOfDoc: 'certificate',
  });
  const theme = useTheme();
  const styles = getStyles(theme);

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
        timeStamp: firestore.FieldValue.serverTimestamp(),
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
      navigation.navigate('Home');
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
  const SubmitDone = () => {
    showMessage({
      message: 'Submission successfully sent.',
      type: 'success',
    });
    navigation.navigate('Home');
  }
  return (
    <ScrollView 
    style={styles.container}
    contentContainerStyle={styles.ScrollView}
    >
    <View style={[styles.LinearGradientWrapper, shadowStyle]}>
    <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y:0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.content,shadowStyle]}
      >
          <Text style={[Global.title,styles.title]}>Certificate Upload</Text>
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
            style={[Global.input,{backgroundColor:theme.backgroundSecondary}]}
            placeholder="Certificate Title"
            onChangeText={(text) => handleInputChange('title', text)}
            value={certificateDetails.title}
          />
          <TextInput
            style={[Global.input,{backgroundColor:theme.backgroundSecondary}]}
            placeholder="Description"
            onChangeText={(text) => handleInputChange('description', text)}
            value={certificateDetails.description}
          />
          <View>
          </View>
      </LinearGradient>
      </View>
      <PrimaryButton
        text="Upload Certificate"
        onPress={uploadCertificate}
        style={styles.button}
      />
      {currentUser && currentUser.status === 'contractor' ? 
      null:
      (<PrimaryButton  
        text='Continue'
        onPress={SubmitDone}
        style={styles.button}
      />)}
    </ScrollView>
  );
};

export default Certificate;

const getStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    flex: 1,
    width: '100%',
    paddingVertical: 20,
  },
  ScrollView: {
    flexGrow: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    gap: 20,
    paddingBottom: 100,
    backgroundColor: theme.background,
  },
  LinearGradientWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content:{
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    width: '90%',
    ...shadowStyle
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderWidth: 1.5,
    borderColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: theme.backgroundSecondary,
    ...shadowStyle
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
  title: {
    color: theme.white,
  },
  placeholderText: {
    color: theme.text,
    fontSize: 16,
  },
});
