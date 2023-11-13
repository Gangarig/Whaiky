import React, { useState, useEffect } from 'react';
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
  Modal,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import CountryPicker from './CountryPicker'; 
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../../context/AuthContext';
import { Global } from '../../../constant/Global';

const DocumentUpload = ({ navigation }) => {
  const { currentUser } = useAuth();

  const [imageFront, setImageFront] = useState(null);
  const [imageBack, setImageBack] = useState(null);
  const [country, setCountry] = useState(null);
  const [dateOfIssue, setDateOfIssue] = useState(null);
  const [dateOfExpiry, setDateOfExpiry] = useState(null);
  const [docType, setDocType] = useState('Passport');
  const [docDetails, setDocDetails] = useState({
    number: '',
    fullName: '',
  });
  const [modalVisible, setModalVisible] = useState(false);

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
      };

      // Store data in Firestore
      await userDocRef.collection('documents').add(docData);

      showMessage({
        message: 'Document uploaded successfully.',
        type: 'success',
      });
      navigation.navigate('Certificate');
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={Global.title}>Document Upload</Text>
          <View style={styles.docTypeSelection}>
            {['Passport', 'ID', "Driver's License"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setDocType(type)}
                style={[
                  styles.docTypeButton,
                  docType === type && styles.activeDocTypeButton,
                ]}
              >
                <Text style={Global.titleSecondary}>{type}</Text>
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
            style={Global.input}
            placeholder="Full Name"
            onChangeText={(text) => handleInputChange('fullName', text)}
            value={docDetails.fullName}
          />

          <Button title="Country of Issue " onPress={() => setModalVisible(true)} />
          {country && <Text style={Global.titleSecondary}>Country of Issue: {country}</Text>}
          <View style={styles.dateBox}>
            <Text style={Global.titleSecondary}>Date of Issue:</Text>
            <DateTimePicker
              value={dateOfIssue ? new Date(dateOfIssue) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDateOfIssue(selectedDate.toISOString().split('T')[0]);
                }
              }}
            />
          </View>
          <View style={styles.dateBox}>
            <Text style={Global.titleSecondary}>Date of Expiry:</Text>
            <DateTimePicker
              value={dateOfExpiry ? new Date(dateOfExpiry) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDateOfExpiry(selectedDate.toISOString().split('T')[0]);
                }
              }}
            />
          </View>

          <Button title="Save and Continue" onPress={uploadData} />
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
      {/* Country Picker Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View>
              <Text style={styles.modalTitle}>Select Country</Text>
              <CountryPicker onSelect={(country) => setCountry(country)} value={country} />
            </View>
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 30,
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
    borderColor: 'black',
    borderRadius: 5,
  },
  activeDocTypeButton: {
    backgroundColor: '#ddd',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    backgroundColor: '#f2f2f2',
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
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
});

export default DocumentUpload;
