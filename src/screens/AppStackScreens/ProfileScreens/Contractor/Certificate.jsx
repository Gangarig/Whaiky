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
import { useTheme } from '../../../../context/ThemeContext';
import FastImage from 'react-native-fast-image';
import Fonts from '../../../../constant/Fonts';
import TwoSelectButton from '../../../../components/Buttons/TwoSelectButton';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


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
          <TouchableOpacity
            onPress={handleChooseImage}
          >
            <LinearGradient
              colors={[theme.primary, theme.tertiary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.imageInput}
            >
            {certificateImage ? (
              <FastImage source={{ uri: certificateImage.path }} style={styles.image} 
              resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={styles.info}>
                <FontAwesomeIcon icon='fa-solid fa-id-card' size={88} color={theme.white} />
                <Text style={styles.text}>Select Certificate Image</Text>
              </View>
            )}
            </LinearGradient>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Certificate Title"
            onChangeText={(text) => handleInputChange('title', text)}
            value={certificateDetails.title}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) => handleInputChange('description', text)}
            value={certificateDetails.description}
          />
          <View style={styles.btn}>
          <TwoSelectButton  
          primary="Upload"
          secondary="Skip"
          onPressPrimary={uploadCertificate}
          onPressSecondary={() => navigation.navigate('Home')}
          />
          </View>
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
    paddingHorizontal : 20
  },
  ScrollView: {
    justifyContent: 'center',
    width: '100%',
  },
  imageInput : {
    width: '100%',
    height:200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  text: {
    color: theme.white,
    fontSize: 14,
    fontFamily: Fonts.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
    color: theme.text,
    fontFamily: Fonts.primary,
    fontSize: 14,
  },
  btn: {
    marginTop: 16,
  },

});
