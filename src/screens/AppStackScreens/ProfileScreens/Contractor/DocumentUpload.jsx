  import React, { useState } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
  } from 'react-native';
  import ImageCropPicker from 'react-native-image-crop-picker';
  import { showMessage } from 'react-native-flash-message';
  import CountryPicker from '../../service/CountryPicker'; 
  import firestore from '@react-native-firebase/firestore';
  import storage from '@react-native-firebase/storage';
  import { useAuth } from '../../../../context/AuthContext';
  import { useTheme } from '../../../../context/ThemeContext';
  import Fonts from '../../../../constant/Fonts';
  import DatePickerComponent from '../../../../components/DatePicker';
  import TwoSelectButton from '../../../../components/Buttons/TwoSelectButton';
  import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
  import LinearGradient from 'react-native-linear-gradient';
  import FastImage from 'react-native-fast-image';


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
        width: 1024,
        height: 800,
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
          showMessage({
            message: 'Document Submitted successfully.',
            type: 'success',
          });
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

    const handleDateOfIssue = (date) => {
      setDateOfIssue(date);
      setOpen(false)
    }
    const handleDateOfExpiry = (date) => {
      setDateOfExpiry(date);
      setOpen(false)
    }

    console.log(imageFront, imageBack, docDetails, country, dateOfIssue, dateOfExpiry, docType, date, open, 'imageFront, imageBack, docDetails, country, dateOfIssue, dateOfExpiry, docType, date, open')

    return (
        <ScrollView style={[styles.container]}
          contentContainerStyle={styles.ScrollView}
        >
        <View style={styles.docType}>
          <TouchableOpacity 
          style={
            docType === 'Passport' ? styles.activeDoc : styles.doc
          }
          onPress={() => setDocType('Passport')}
          >
            <FontAwesomeIcon icon='fa-solid fa-passport' size={25} 
            color={docType === 'Passport' ? theme.primary : theme.white} />
            {docType === 'Passport' && (
              <Text style={styles.docText}>
                Passport
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
          style={
            docType === "ID" ? styles.activeDoc : styles.doc
          }
          onPress={() => setDocType('ID')}
          >
              <FontAwesomeIcon icon='fa-solid fa-id-badge' size={25} color={docType === 'ID' ? theme.primary : theme.white} />
              {docType === 'ID' && (
                <Text style={styles.docText}>
                  ID
                </Text>
              )}
          </TouchableOpacity >
          <TouchableOpacity 
          style={
            docType === "Driver's License" ? styles.activeDoc : styles.doc
          }
          onPress={() => setDocType("Driver's License")}
          >    
            <FontAwesomeIcon icon='fa-solid fa-car' size={25} color={docType === "Driver's License" ? theme.primary : theme.white} />  
            {docType === "Driver's License" && (
              <Text style={styles.docText}>
                Driver's License
              </Text>
            )}
          </TouchableOpacity>
        </View>
        {docType === 'Passport' && (
            <TouchableOpacity
              onPress={() => handleChoosePhoto('front')}
            >
              <LinearGradient
              colors={[theme.primary, theme.tertiary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.imageInput}
              >
                {imageFront ? (
                  <FastImage 
                  source={{ uri: imageFront.path }} 
                  style={styles.docImage}
                  resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View style={styles.info}>
                  <FontAwesomeIcon icon='fa-solid fa-id-card' size={88} color={theme.white} />
                  <Text style={styles.text}>Select {docType} Image</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        {docType !== 'Passport' && (
            <>
              <TouchableOpacity
                onPress={() => handleChoosePhoto('front')}
              >
                <LinearGradient 
                colors={[theme.primary, theme.tertiary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.imageInput}
               >
                {imageFront ? (
                  <FastImage 
                  source={{ uri: imageFront.path }} 
                  style={styles.docImage}
                  resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View style={styles.info}>
                  <FontAwesomeIcon icon='fa-solid fa-id-card' size={88} color={theme.white} />
                  <Text style={styles.text}>Select {docType} Image</Text>
                  </View>
                )}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChoosePhoto('back')}
              >
                <LinearGradient 
                colors={[theme.primary, theme.tertiary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.imageInput}
               >
                {imageBack ? (
                  <FastImage 
                  source={{ uri: imageBack.path }} 
                  style={styles.docImage}
                  resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View style={styles.info}>
                  <FontAwesomeIcon icon='fa-solid fa-id-card' size={88} color={theme.white} />
                  <Text style={styles.text}>Select {docType} Image</Text>
                  </View>
                )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        <TextInput  
        style={styles.input}
        placeholder={`${docType} Number`}
        value={docDetails.number}
        placeholderTextColor={theme.gray}
        onChangeText={(text) => handleInputChange('number', text)}
        />
        <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={docDetails.fullName}
        placeholderTextColor={theme.gray}
        onChangeText={(text) => handleInputChange('fullName', text)}
        />
        <View style={styles.btnContainer}>
        <TwoSelectButton
          primary={
            <DatePickerComponent
              date={date}
              open={open}
              setOpen={setOpen}
              mode='date'
              handleDate={handleDateOfIssue}
              onSave={handleDateOfIssue} 
            />
          }
          secondary='Date of Issue'
          onPressPrimary={() => setOpen(true)}
          secondaryDisabled={true}
          primaryDisabled={true}
          onPressSecondary={() => setOpen(true)}
        />
          <TwoSelectButton  
          primary={
            <DatePickerComponent
            date={date}
            open={open}
            setOpen={setOpen}
            mode='date'
            onSave={handleDateOfExpiry}
            handleDate={handleDateOfExpiry}
            />
          }
          secondary='Date of Expiry'
          onPressPrimary={() => setOpen(true)}
          secondaryDisabled={true}
          primaryDisabled={true}
          onPressSecondary={() => setOpen(true)}
          />
          <TwoSelectButton  
          secondary={country ? country : 'Country of Issue'}
          primary='Upload Document'
          icon={true}
          onPressSecondary={() => setCountryPickerVisible(true)}
          onPressPrimary={() => uploadData()}
          />
        </View>

        
        <CountryPicker
          onSelect={(selectedCountry) => setCountry(selectedCountry)}
          isModalVisible={isCountryPickerVisible}
          setModalVisibility={setCountryPickerVisible}
        />
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
      paddingHorizontal: 20,
   
    },
    ScrollView: {
      justifyContent: 'center',
      paddingBottom: 50,
    },
    docType: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: theme.primary,
      height: 40,
      overflow: 'hidden',
    },
    doc: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeDoc: {
      height: '100%',
      width: '66.66%',
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    docText: {
      color: theme.text,
      fontWeight: 'bold',
      fontFamily: Fonts.primary,
      fontSize:14,
      paddingLeft: 20,
    },
    imageInput : {
      width: '100%',
      height:200,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      marginTop: 16,
    },
    docImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary,
      overflow: 'hidden',
    },
    info: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      gap: 5,
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
    btnContainer: {
      marginTop: 16,
      gap: 16,
    },
    text: {
      color: theme.white,
      fontFamily: Fonts.primary,
      fontSize: 14,
    },
  });
  }

  export default DocumentUpload;
