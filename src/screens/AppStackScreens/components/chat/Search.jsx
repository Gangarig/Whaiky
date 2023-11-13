import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  ActivityIndicator,
  ScrollView,
  Alert,Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { query, getDocs, where, collection,
getDoc, doc, setDoc, updateDoc, serverTimestamp
} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const Search = ({ isVisible, onClose, navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [user, setUser] = useState();
  const handleSearch = async () => {
    setLoading(true);

    // Adjusted the query to use firestore().collection() instead
    const q = firestore().collection('users').where('displayName', '==', searchTerm);

    try {
      const querySnapshot = await q.get();
      const fetchedUsers = querySnapshot.docs.map(doc => doc.data());

      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error while searching:', error.message);
    } finally {
      setLoading(false);
    }
};

  
const handleSelect = async (selectedUser) => {
  if (!currentUser?.uid || !selectedUser?.uid) {
    return;
  }

  console.log("handleSelect started");

  const combinedId = currentUser.uid > selectedUser.uid ? currentUser.uid + selectedUser.uid : selectedUser.uid + currentUser.uid;
  console.log("Combined ID:", combinedId);

  try {
    const res = await firestore().collection('chats').doc(combinedId).get();
    console.log("Chat doc exists:", res.exists);

    if (!res.exists) {
      await firestore().collection('chats').doc(combinedId).set({ messages: [] });
    }

    // Update for currentUser
    await firestore().collection('userChats').doc(currentUser.uid).set({
      [`${combinedId}`]: {
        date: firestore.FieldValue.serverTimestamp(),
        userInfo: {
          uid: selectedUser.uid,
          displayName: selectedUser.displayName,
          photoURL: selectedUser.photoURL
        }
      }
    }, { merge: true });

    // Update for selectedUser
    await firestore().collection('userChats').doc(selectedUser.uid).set({
      [`${combinedId}`]: {
        date: firestore.FieldValue.serverTimestamp(),
        userInfo: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        }
      }
    }, { merge: true });

    console.log('handleSelect function called!');
    
  } catch (error) {
    console.error("Error in handleSelect:", error.message);
  }
};






  return (
    <SafeAreaView>
      <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.container}> 
          <TextInput
            style={styles.textInput}
            placeholder="Find users"
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
          />
          <Button title="Search" onPress={handleSearch} />
          {loading && (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
          )}
            <ScrollView style={styles.usersList}>
                {users.map(user => (
                    <TouchableOpacity
                        key={user.uid}
                        style={styles.userChat}
                        onPress={() => {
                            handleSelect(user);
                            onClose();
                        }}
                    >
                        {/* Display Avatar */}
                        <Image
                            source={{ uri: user.photoURL || 'default_avatar_url' }}  // Make sure to replace 'default_avatar_url' with a placeholder image URL in case the user doesn't have an avatar.
                            style={styles.avatar}
                        />
                        
                        {/* Display User Information */}
                        <View style={styles.userInfo}>
                            <Text style={styles.displayName}>{user.displayName}</Text>
                            <Text>{user.email}</Text>
                            <Text>{user.uid}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cccccc',
    padding: 20,
  },
  textInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  usersList: {
    flex: 1,
  },
  userChat: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ebebeb',
    borderRadius: 10,
    marginBottom: 10,
  },
  avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
  },
  userInfo: {
      flex: 1,
  },
  displayName: {
      fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    alignSelf: 'center',
  },
  loading: {
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export default Search;
