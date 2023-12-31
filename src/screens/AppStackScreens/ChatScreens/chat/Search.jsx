import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import defaultAvatar from '../../../../assets/images/avatar/avatar.png';
import FastImage from 'react-native-fast-image';
import { handleSelect } from '../../service/ChatService';
import { useAuth } from '../../../../context/AuthContext';
import { showMessage } from 'react-native-flash-message';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import Colors from '../../../../constant/Colors';



const Search = ({ isVisible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();  

  // Function to fetch users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRef = firestore().collection('users');
      const snapshot = await usersRef.get();
      const fetchedUsers = snapshot.docs.map(doc => doc.data());
      setAllUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers([]);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = allUsers.filter(user =>
        user.displayName.toLowerCase().includes(lowerCaseSearchTerm) ||
        (user.firstName && user.firstName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (user.lastName && user.lastName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        user.email.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  const handleSelectUser = async (selectedUser) => {
    if (currentUser) {
      await handleSelect(currentUser, selectedUser)
        .then(() => {
        })
        .catch(error => {
          console.error("Error in handleSelectUser:", error.message);
          showMessage({
            message: error.message,
            type: 'danger',
          });
        });
      onClose(); 
    } else {
      showMessage({
        message: 'User not found.',
        type: 'danger',
      });
    }
  };
  

  return (

    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={[styles.inputWrapper]}>
        <TextInput
          style={[styles.textInput]}
          placeholder="Find users"
          onChangeText={setSearchTerm}
          value={searchTerm}
        />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
        ) : (
          <ScrollView style={styles.usersList}>
            {filteredUsers.map(user => (
              <TouchableOpacity
                key={user.uid}
                style={[styles.userChat]}
                onPress={() => {
                  handleSelectUser(user);
                  onClose();
                }}
              >
                <FastImage
                  source={user.photoURL ? { uri: user.photoURL } : defaultAvatar}
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.displayName}>{user.displayName}</Text>
                  <Text>{user.email}</Text>
                </View>
              </TouchableOpacity>
            ))}

          </ScrollView> 

        )}
            <View style={styles.closeBtn}>
            <PrimaryButton text="Close" onPress={onClose} />
            </View>
      </View>
      
    </Modal>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    paddingLeft: 10,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    fontWeight: '600',
  },
  usersList: {
    marginTop: 10,
  },
  userChat: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  loading: {
    marginTop: 20,
  },
  closeBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    left: 0,
    zIndex: 100,
  },
});

export default Search;