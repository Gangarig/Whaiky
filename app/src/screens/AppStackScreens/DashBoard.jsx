import { View, Text, StyleSheet, Touchable } from 'react-native'
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
          (querySnapshot) => {
            const newSubmissions = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setSubmissions(newSubmissions);
            console.log('newSubmissions', newSubmissions);
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
            </View>
          )}
        />
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
