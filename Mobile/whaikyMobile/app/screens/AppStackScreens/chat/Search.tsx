import React, { useContext, useState } from 'react';
import {
  Modal, View, TextInput, Text, TouchableOpacity, StyleSheet, Button
} from 'react-native';
import {
  collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc
} from 'firebase/firestore';
import { firestore } from '../../../../FirebaseConfig';
import { useUser } from '../../../context/UserContext';

const Search: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { currentUser } = useUser();

  const handleSearch = async () => {
    const q = query(
      collection(firestore, 'users'),
      where('displayName', '==', displayName)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        setErr(true);
      }
    } catch (error) {
      setErr(true);
    }
  };

  const handleKey = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    
    if (!currentUser?.uid || !user?.uid) {
      return;
    }

    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
   
    try {
      const res = await getDoc(doc(firestore, 'chats', combinedId));
      
      if (!res.exists()) {
        await setDoc(doc(firestore, 'chats', combinedId), { messages: [] });

        await updateDoc(doc(firestore, 'userChats', currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });

        await updateDoc(doc(firestore, 'userChats', user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(error);
    }
    
    setUser(null);
    setDisplayName('');
  };

  return (
    <View style={styles.container}>
      <Button title="Search" onPress={() => setModalVisible(true)} />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.textInput}
              placeholder="Find a user"
              onChangeText={(text) => setDisplayName(text)}
              onKeyPress={handleKey}
              value={displayName}
            />
            {err && <Text>User not found!</Text>}
            {user && (
              <TouchableOpacity 
                style={styles.userChat} 
                onPress={() => { 
                  handleSelect();
                  setModalVisible(false);
                }}
              >
                <Text>{user.displayName}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }, 
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
  },
  userChat: {
    padding: 10,
    backgroundColor: '#ebebeb',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Search;
