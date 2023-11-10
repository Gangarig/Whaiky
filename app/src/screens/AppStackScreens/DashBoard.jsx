import { View, Text, StyleSheet, Touchable, Button } from 'react-native'
import React,{ useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Global } from '../../../style/Global'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'
import { FlatList } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native'






const DashBoard = ({navigation}) => {
  const { currentUser } = useAuth()
  const [userData, setUserData] = useState(null)
  const [submissions , setSubmissions] = useState([])


  firestore()
    .collection('users')
    .doc(currentUser.uid)
    .get()
    .then((documentSnapshot) => {
      if (documentSnapshot.exists) {
        setUserData(documentSnapshot.data())
      }
    })
    .catch((error) => {
      console.log('Error:', error)
      showMessage({
        message: 'Error fetching user data.',
        type: 'danger',
      })
    })

    useEffect(() => {
      const unsubscribe = firestore()
        .collection('submission')
        .onSnapshot(
          async (querySnapshot) => {
            const operations = querySnapshot.docs.map(async (doc) => {
              const userId = doc.data().userId;
    
              // Asynchronously check for documents existence
              const documentsExist = await firestore()
                .collection('users')
                .doc(userId)
                .collection('documents')
                .limit(1)
                .get()
                .then(docSnapshot => docSnapshot.size > 0);
    
              // Asynchronously check for certificates existence if documents don't exist
              const certificatesExist = !documentsExist && await firestore()
                .collection('users')
                .doc(userId)
                .collection('certificates')
                .limit(1)
                .get()
                .then(docSnapshot => docSnapshot.size > 0);
              
              // If neither documents nor certificates exist, delete the submission
              if (!documentsExist && !certificatesExist) {
                await firestore().collection('submission').doc(doc.id).delete();
                return null; // Returning null to filter out later
              }
    
              // Return the submission data if either documents or certificates exist
              return { id: doc.id, ...doc.data() };
            });
    
            const submissionsWithChecks = await Promise.all(operations);
            
            // Filter out any null submissions (which were deleted)
            setSubmissions(submissionsWithChecks.filter(submission => submission !== null));
          },
          (error) => {
            console.log('Error fetching submissions:', error);
            showMessage({
              message: 'Error fetching submissions.',
              type: 'danger',
            });
          },
        );
    
      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, []);
    
    const Done = async (item) => {
      firestore()
      .collection('submission')
      .doc(item.id)
      .delete()
      .then(() => {
        showMessage({
          message: 'Submission completed successfully',
          type: 'success',
        });
      })
      .catch((error) => {
        console.error('Error removing submission: ', error);
        showMessage({
          message: 'Error removing submission',
          type: 'danger',
        });
      });
    
    }  
    
    return (
      <View style={styles.container}>
        <Text style={Global.title}>Dashboard</Text>
        <Text style={Global.titleSecondary}> Document submissions</Text>
        <FlatList
          data={submissions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.submissionItem}>
              <TouchableOpacity onPress={() => navigation.navigate('SubmitDetail', { id: item.id })}>
              <Text style={styles.submissionTitle}>Submit ID : {item.userId}</Text>
              </TouchableOpacity> 
              <TouchableOpacity onPress={() => Done}>
              <Text style={styles.submissionTitle}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <Button title='Back' onPress={() => navigation.goBack()} />
      </View>
    );    
}


export default DashBoard


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  submissionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  submissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
