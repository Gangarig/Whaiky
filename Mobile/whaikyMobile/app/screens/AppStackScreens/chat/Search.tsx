import React, { useContext, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import {firestore} from '../../../../FirebaseConfig';
import { useUser } from '../../../context/UserContext';

const Search: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState<boolean>(false);

  const { currentUser } = useUser();

  const handleSearch = async () => {
    const q = query(
      collection(firestore, "users"),
      where("userName", "==", username) // I've changed this to userName
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
      <View style={styles.searchForm}>
        <TextInput
          placeholder="Find a user"
          onSubmitEditing={handleKey}
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
      </View>
      {err && <Text>User not found!</Text>}
      {user && (
        <TouchableOpacity style={styles.userChat} onPress={handleSelect}>
          {/* Replace with an Image component if you have the image */}
          <Text>Profile Image Here</Text>
          <View style={styles.userChatInfo}>
            <Text>{user.userName}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
