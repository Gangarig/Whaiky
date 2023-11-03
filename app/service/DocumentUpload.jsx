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
  Modal,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import DatePicker from 'react-native-date-picker';
import { useAuth } from '../src/context/AuthContext';
import CountryPicker from './CountryPicker';

const DocumentUpload = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [country, setCountry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateOfIssue, setDateOfIssue] = useState(new Date());
  const [dateOfExpiry, setDateOfExpiry] = useState(new Date());
  const [docType, setDocType] = useState('Passport');
  const [docDetails, setDocDetails] = useState({
    number: '',
    fullName: '',
  });
  const [isDatePickerVisible, setIsDatePickerVisible] = useState({
    issue: false,
    expiry: false,
  });

  const { currentUser } = useAuth();

  const handleChoosePhoto = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        setImage(image);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadData = async () => {
    console.log('Uploading data...');
  };

  const handleInputChange = (field, value) => {
    setDocDetails({
      ...docDetails,
      [field]: value,
    });
  };

  const validateForm = () => {
    if (!image) return 'Please select an image.';
    if (!docDetails.number) return `Please enter a ${docType} number.`;
    if (!docDetails.fullName) return 'Please enter a full name.';
    if (!country) return 'Please select a country of issue.';
    return '';
  };

  const handleDocUpload = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      showMessage({
        message: errorMessage,
        type: 'warning',
      });
      return;
    }

    await uploadData();
    showMessage({
      message: 'Document uploaded successfully!',
      type: 'success',
    });

    setImage(null);
    setDocDetails({ number: '', fullName: '' });
    setCountry(null);
    setDateOfIssue(new Date());
    setDateOfExpiry(new Date());
  };

  const ModalContainer = ({ isVisible, onConfirm, children }) => (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {children}
          <Button title="Confirm" onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Document Upload</Text>
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
              <Text style={styles.docTypeText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image.path }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>Tap to select an image</Text>
          )}
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`${docType} Number`}
            onChangeText={(text) => handleInputChange('number', text)}
            value={docDetails.number}
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            onChangeText={(text) => handleInputChange('fullName', text)}
            value={docDetails.fullName}
          />
          <Button title="Select Country" onPress={() => setModalVisible(true)} />
          {country && <Text>Country of Issue: {country}</Text>}
          <Button title="Select Date of Issue" onPress={() => setIsDatePickerVisible({ ...isDatePickerVisible, issue: true })} />
          {dateOfIssue && <Text>Date of Issue: {dateOfIssue.toDateString()}</Text>}
          <Button title="Select Date of Expiry" onPress={() => setIsDatePickerVisible({ ...isDatePickerVisible, expiry: true })} />
          {dateOfExpiry && <Text>Date of Expiry: {dateOfExpiry.toDateString()}</Text>}
          <Button title="Upload Document" onPress={handleDocUpload} />
        </View>

        <ModalContainer isVisible={isDatePickerVisible.issue} onConfirm={() => setIsDatePickerVisible({ ...isDatePickerVisible, issue: false })}>
          <DatePicker date={dateOfIssue} onDateChange={setDateOfIssue} mode="date" />
        </ModalContainer>

        <ModalContainer isVisible={isDatePickerVisible.expiry} onConfirm={() => setIsDatePickerVisible({ ...isDatePickerVisible, expiry: false })}>
          <DatePicker date={dateOfExpiry} onDateChange={setDateOfExpiry} mode="date" />
        </ModalContainer>

        <ModalContainer isVisible={modalVisible} onConfirm={() => setModalVisible(false)}>
          <CountryPicker onSelect={(country) => {
            setCountry(country);
            setModalVisible(false);
          }} />
        </ModalContainer>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  docTypeSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  docTypeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  activeDocTypeButton: {
    backgroundColor: '#ddd',
  },
  docTypeText: {
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
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
  placeholderText: {
    color: '#999',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default DocumentUpload;
