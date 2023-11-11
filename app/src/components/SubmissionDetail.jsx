import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Global } from '../../style/Global';
import { showMessage } from 'react-native-flash-message';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image'


const SubmissionDetail = ({ navigation, route }) => {
  const id = route.params.id;
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const docSnapshot = await firestore().collection('users').doc(id).collection('documents').get();
        const certSnapshot = await firestore().collection('users').doc(id).collection('certificates').get();
        
        // Combine documents and certificates, and filter out items with status 'approved'
        const combinedSubmissions = [
          ...docSnapshot.docs.map(doc => ({ id: doc.id, type: 'document', ...doc.data() })),
          ...certSnapshot.docs.map(cert => ({ id: cert.id, type: 'certificate', ...cert.data() })),
        ].filter(item => item.status !== 'approved');
  
        if (combinedSubmissions.length === 0) {
          navigation.goBack();
        } else {
          setSubmissions(combinedSubmissions);
        }
      } catch (error) {
        console.error('Error fetching submissions: ', error);
        showMessage({ message: 'Error fetching submissions', type: 'danger' });
      }
    };
  
    fetchSubmissions();
  }, [id, navigation]);
  

  const removeSubmissionById = (submissionId) => {
    setSubmissions(currentSubmissions => {
      const updatedSubmissions = currentSubmissions.filter(submission => submission.id !== submissionId);
      if (updatedSubmissions.length === 0) {
        navigation.goBack();
      }
      return updatedSubmissions;
    });
  };

  const deleteImage = async (imageUrl) => {
    try {
      console.log('Deleting image: ', imageUrl);
      const imageRef = storage().refFromURL(imageUrl);
      await imageRef.delete();
      console.log('Image has been deleted successfully.');
    } catch (error) {
      console.error('Error while deleting the image: ', error);
      showMessage({
        message: 'Error deleting image',
        type: 'danger',
      });
    }
  };

  const Approve = async (item) => {
    if(item.type == 'certificate')
    {
      try{
      firestore()
      .collection('users')
      .doc(id)
      .collection('certificates') 
      .doc(item.id)
      .update({
        status: 'approved',
      })
      .then(() => {
        showMessage({
          message: 'Certificate approved!',
          type: 'success',
        });
        console.log('Certificate approved!');
        removeSubmissionById(item.id);
      });
      }
      catch(error){
        console.log(error);
    }
    }
    else
    {
      try{
      firestore()
      .collection('users')
      .doc(id)
      .collection('documents') 
      .doc(item.id)
      .update({
        status: 'approved',
      })
      .then(() => {
        showMessage({
          message: 'Document approved!',
          type: 'success',
        });
        console.log('Document approved!');
        removeSubmissionById(item.id);
      });
    }
      catch(error){
        showMessage({
          message: 'Error approving document',
          type: 'danger',
        });
        console.log(error);
      }
    }
  };
  
  const Deny = async (item) => {
      console.log(item);
      if(item.frontImage)
      {
      await deleteImage(item.frontImage);
      }
      if(item.backImage)
      {
      await deleteImage(item.backImage);
      }
    if(item.type == 'certificate')
    {
      firestore()
      .collection('users')
      .doc(id)
      .collection('certificates') 
      .doc(item.id)
      .delete()
      .then(() => {
        showMessage({
          message: 'Certificate deleted!',
          type: 'success',
        });
        console.log('Certificate deleted!');
        removeSubmissionById(item.id);
      });
    }
    else
    {
      firestore()
      .collection('users')
      .doc(id)
      .collection('documents') 
      .doc(item.id)
      .delete()
      .then(() => {
        showMessage({
          message: 'Document deleted!',
          type: 'success',
        });
        console.log('Document deleted!');
        removeSubmissionById(item.id);
      });
      
    }
  };
  const clean = async () => {
    await firestore().collection('submission').doc(id).delete();
  }
  if (submissions.length === 0) {
    clean();
  }

  
  const renderSubmissionItem = ({ item }) => (
    <View style={styles.itemContainer}>
    <Text style={styles.documentType}>

      {['Passport', 'ID', "Driver's License"].includes(item.type) ? 'Document Type: ' : 'Certificate Title: '}
      {['Passport', 'ID', "Driver's License"].includes(item.type) ? item.type : item.title}
    </Text>
    {['Passport', 'ID', "Driver's License"].includes(item.type) && (
        <>
          {/* Document-specific text fields */}
          <Text style={styles.textField}>Document Number: {item.number}</Text>
          <Text style={styles.textField}>Full Name: {item.fullName}</Text>
          <Text style={styles.textField}>Country of Issue: {item.country}</Text>
          <Text style={styles.textField}>Date of Issue: {item.dateOfIssue}</Text>
          <Text style={styles.textField}>Date of Expiry: {item.dateOfExpiry}</Text>
          {/* Document images */}
          {item.frontImage && 
            <FastImage
              source={{ uri: item.frontImage }}
              style={styles.image}
              resizeMode={FastImage.resizeMode.contain}
            />
           }
          {item.backImage && 
            <FastImage
              source={{ uri: item.backImage }}
              style={styles.image}
              resizeMode={FastImage.resizeMode.contain}
          />}
        </>
      )}
      {item.type === 'certificate' && (
        <>
          <Text style={styles.textField}>Certificate Title: {item.title}</Text>
          <Text style={styles.textField}>Certificate Description: {item.description}</Text>
          <FastImage
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.contain}
          />
        </>
      )}
      <View style={styles.buttonBox}>
            <Button title='Approve' onPress={() => Approve(item)} />
            <Button title='Deny' onPress={() => Deny(item)} />
      </View>
   
    </View>
  );
  

  

  return (
    <View style={styles.container}>
      <Text style={Global.title}>Submission Details</Text>
      <FlatList
        data={submissions}
        keyExtractor={(item) => item.id}
        renderItem={renderSubmissionItem}
      />
         <Button title='Back' onPress={() => navigation.goBack()} />
    </View>
  );
};

export default SubmissionDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  documentType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
