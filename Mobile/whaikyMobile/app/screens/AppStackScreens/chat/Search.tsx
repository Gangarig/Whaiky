import React, { useContext, useState } from 'react';
import {Modal, View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import {firestore} from '../../../../FirebaseConfig';
import { useUser } from '../../../context/UserContext';

const Search: React.FC = () => {
  const [userName, setUsername] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { currentUser } = useUser();

  const handleSearch = async () => {
    const q = query(
      collection(firestore, "users"),
      where("userName", "==", userName) // I've changed this to userName
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
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
      // Handle the case where either UID is undefined
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
            userName: user.userName,
            photoURL: user.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });

        await updateDoc(doc(firestore, 'userChats', user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            userName: currentUser.userName,
            photoURL: currentUser.avatarURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error(err);
    }

    setUser(null);
    setUsername("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>Show Search</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Find a user"
              // ... (other TextInput props)
            />
            {/* Search results and error handling here */}
            {err && <Text>User not found!</Text>}
            {user && (
              <TouchableOpacity 
                style={styles.userChat} 
                onPress={() => { 
                  handleSelect();
                  setModalVisible(false);
                }}
              >
                <Text>{user.userName}</Text>
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
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }, 
  searchForm: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  userChat: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  userChatInfo: {
    marginLeft: 10,
  },
});

export default Search;
