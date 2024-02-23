import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import CountryPicker from '../../service/CountryPicker'; 
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useAuth } from '../../../../context/AuthContext';
import { Global } from '../../../../constant/Global';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import { shadowStyle } from '../../../../constant/Shadow';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../../context/ThemeContext';
import DatePicker from 'react-native-date-picker'




const DocumentUpload = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [imageFront, setImageFront] = useState(null);
  const [imageBack, setImageBack] = useState(null);
  const [country, setCountry] = useState(null);
  const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);
  const [dateOfIssue, setDateOfIssue] = useState(null);
  const [dateOfExpiry, setDateOfExpiry] = useState(null);
  const [docType, setDocType] = useState('Passport');
  const [docDetails, setDocDetails] = useState({
    number: '',
    fullName: '',
  });
  const theme = useTheme();
  const styles = getStyles(theme);
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false) 

  const handleChoosePhoto = (imageNumber) => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        if (imageNumber === 'front') {
          setImageFront(image);
        } else if (imageNumber === 'back') {
          setImageBack(image);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadData = async () => {
    try {
      // Check for required fields
      if (!docDetails.number || !docDetails.fullName || !country || !dateOfIssue || !dateOfExpiry) {
        showMessage({
          message: 'Please fill in all required fields and select dates.',
          type: 'warning',
        });
        return;
      }

      let frontImageUri = '';
      let backImageUri = '';

      if (docType === 'Passport') {
        if (!imageFront) {
          showMessage({
            message: 'Please select the passport image.',
            type: 'warning',
          });
          return;
        }
      } else if (docType === 'ID' || docType === "Driver's License") {
        if (!imageFront || !imageBack) {
          showMessage({
            message: 'Please select both front and back images.',
            type: 'warning',
          });
          return;
        }
      }

      // Check if a document with the same docType exists for the user
      const userDocRef = firestore().collection('users').doc(currentUser.uid);
      const existingDocQuery = await userDocRef
        .collection('documents')
        .where('type', '==', docType)
        .get();

      if (!existingDocQuery.empty) {
        // Delete the old document and its associated storage files
        const oldDoc = existingDocQuery.docs[0];
        const oldDocData = oldDoc.data();

        await userDocRef.collection('documents').doc(oldDoc.id).delete();

        if (oldDocData.frontImage) {
          await storage().refFromURL(oldDocData.frontImage).delete();
        }

        if (oldDocData.backImage) {
          await storage().refFromURL(oldDocData.backImage).delete();
        }
      }

      if (imageFront) {
        // Upload the front image
        const frontImageRef = storage().ref(`docs/${currentUser.uid}/${docType}/${docType}Front`);
        const frontImageResponse = await frontImageRef.putFile(imageFront.path);

        if (frontImageResponse.state === 'success') {
          frontImageUri = await frontImageRef.getDownloadURL();
        } else {
          showMessage({
            message: 'Error uploading the front image.',
            type: 'danger',
          });
          return;
        }
      }

      if (docType !== 'Passport' && imageBack) {
        // Upload the back image
        const backImageRef = storage().ref(`docs/${currentUser.uid}/${docType}/${docType}Back`);
        const backImageResponse = await backImageRef.putFile(imageBack.path);

        if (backImageResponse.state === 'success') {
          backImageUri = await backImageRef.getDownloadURL();
        } else {
          showMessage({
            message: 'Error uploading the back image.',
            type: 'danger',
          });
          return;
        }
      }

      // Create a document object
      const docData = {
        type: docType,
        number: docDetails.number,
        fullName: docDetails.fullName,
        country: country,
        dateOfIssue: dateOfIssue,
        dateOfExpiry: dateOfExpiry,
        frontImage: frontImageUri,
        backImage: backImageUri,
        status: 'pending',
        typeOfDoc: 'document',
        timeStamp: firestore.FieldValue.serverTimestamp(),
      };

      // Store data in Firestore
      await userDocRef.collection('documents').add(docData);
      // Save the submission in the 'submission' collection with the user's userId as the submission ID
      await firestore().collection('submission').doc(currentUser.uid).set({
        userId: currentUser.uid,
        type: docType,
        timeStamp: firestore.FieldValue.serverTimestamp(),
        status: 'pending',

      });



      showMessage({
        message: 'Document uploaded successfully.',
        type: 'success',
      });
      if( currentUser.status === 'contractor') {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Certificate');
      }

      // After successful upload, you can reset the form.
      resetForm();
    } catch (error) {
      showMessage({
        message: 'An error occurred while uploading the document.',
        type: 'danger',
      });
    }
  };

  const resetForm = () => {
    setImageFront(null);
    setImageBack(null);
    setCountry(null);
    setDateOfIssue(null);
    setDateOfExpiry(null);
    setDocDetails({ number: '', fullName: '' });
  };

  const handleInputChange = (field, value) => {
    setDocDetails({
      ...docDetails,
      [field]: value,
    });
  };

  return (
      <ScrollView style={[styles.container]}
        contentContainerStyle={styles.ScrollView}
      >
        <View style={[styles.LinearGradientWrapper, shadowStyle]}>
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[shadowStyle,styles.inputContainer,
          ]}
          >
          <Text style={[Global.title,styles.title]}>Document Upload</Text>
          <View style={[styles.docTypeSelection,shadowStyle]}>
            {['Passport', 'ID', "Driver's License"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setDocType(type)}
                style={[
                  styles.docTypeButton,
                  docType === type && styles.activeDocTypeButton,
                ]}
              >
                <Text style={[
                  Global.titleSecondary,styles.titleSecondary,
                  docType === type && styles.activeDocTypeButton,
                  ]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {docType === 'Passport' && (
            <TouchableOpacity
              onPress={() => handleChoosePhoto('front')}
              style={styles.imageContainer}
            >
              {imageFront ? (
                <Image source={{ uri: imageFront.path }} style={styles.image} />
              ) : (
                <Text style={styles.placeholderText}>Select Passport Image</Text>
              )}
            </TouchableOpacity>
          )}
          {docType !== 'Passport' && (
            <>
              <TouchableOpacity
                onPress={() => handleChoosePhoto('front')}
                style={styles.imageContainer}
              >
                {imageFront ? (
                  <Image source={{ uri: imageFront.path }} style={styles.image} />
                ) : (
                  <Text style={styles.placeholderText}>Select Front Image</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChoosePhoto('back')}
                style={styles.imageContainer}
              >
                {imageBack ? (
                  <Image source={{ uri: imageBack.path }} style={styles.image} />
                ) : (
                  <Text style={styles.placeholderText}>Select Back Image</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TextInput
            style={Global.input}
            placeholder={`${docType} Number`}
            onChangeText={(text) => handleInputChange('number', text)}
            value={docDetails.number}
          />
          <TextInput
            style={[Global.input]}
            placeholder="Full Name"
            onChangeText={(text) => handleInputChange('fullName', text)}
            value={docDetails.fullName}
          />
          {country && <Text style={[Global.titleSecondary,styles.titleSecondary]}>Country of Issue: {country}</Text>}
          <View style={styles.dateBox}>
            <Text style={[Global.titleSecondary,styles.titleSecondary]}>Date of Issue:</Text>
            <View style={styles.dateWrapper}>
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                  setOpen(false)
                  setDate(date)
                }}
                onCancel={() => {
                  setOpen(false)
                }}
              />
            </View>
          </View>
          <View style={styles.dateBox}>
            <Text style={[Global.titleSecondary,styles.titleSecondary]}>Date of Expiry:</Text>
            <View style={styles.dateWrapper}>
              <TouchableOpacity 
              onPress={() => setOpen(true)}
              style={styles.dateWrapper}>
              <Text style={styles.placeholderText}>Select Date</Text>
              </TouchableOpacity>
            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={(date) => {
                setOpen(false)
                setDate(date)
              }}
              onCancel={() => {
                setOpen(false)
              }}
            />
            </View>
          </View>
        </LinearGradient>
        </View>
      {/* CountryPicker as a modal */}
      <CountryPicker
        onSelect={(selectedCountry) => setCountry(selectedCountry)}
        isModalVisible={isCountryPickerVisible}
        setModalVisibility={setCountryPickerVisible}
      />
        <PrimaryButton text="Country of Issue " onPress={() => setCountryPickerVisible(true)} />
        <PrimaryButton text="Upload Document" onPress={uploadData} />
      </ScrollView>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
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
  docTypeSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  docTypeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.white,
    borderRadius: 5,
    backgroundColor: theme.primary,
  },
  activeDocTypeButton: {
    backgroundColor: theme.background,
    color: theme.black,
    borderColor: theme.black,
  },
  title: {
    color: theme.white,
  },
  titleSecondary: {
    color: theme.white,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderWidth: 1.5,
    ...shadowStyle,
    borderColor: theme.black,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height: 360,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalCloseButton: {
    marginTop: 20,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    width: 300,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    width: '90%',
  },
  dateWrapper: {
    width: 150,
      height: 50,
      backgroundColor: theme.background,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadowStyle,
    },
  placeholderText: {
    color: theme.text,
    fontSize: 16,
  },
    
});
}

export default DocumentUpload;
