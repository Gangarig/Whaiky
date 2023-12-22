import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

export const handleSelect = async (currentUser, selectedUser) => {
  if (!currentUser?.uid || !selectedUser?.uid) {
    showMessage({
      message: 'Invalid user details.',
      type: 'info',
    });
    return;
  }
  const combinedId = currentUser.uid > selectedUser.uid ? currentUser.uid + selectedUser.uid : selectedUser.uid + currentUser.uid;
  try {
    // Check if the chat already exists for the current user
    const currentUserChatRef = firestore().collection('userChats').doc(currentUser.uid);
    const currentUserChatDoc = await currentUserChatRef.get();

    if (currentUserChatDoc.exists && currentUserChatDoc.data()[combinedId]) {
      console.log('Chat already exists.');
      showMessage({
        message: 'Chat already exists with this user.',
        type: 'info',
      });
      return; // Exit if the chat already exists
    }

    const chatRef = firestore().collection('chats').doc(combinedId);
    const chatDoc = await chatRef.get();

    const userChatData = (user, otherUser) => ({
      date: firestore.FieldValue.serverTimestamp(),
      userInfo: {
        uid: otherUser.uid,
        displayName: otherUser.displayName,
        photoURL: otherUser.photoURL
      }
    });

    // Update for currentUser
    await currentUserChatRef.set({
      [combinedId]: userChatData(currentUser, selectedUser)
    }, { merge: true });

    // Update for selectedUser
    await firestore().collection('userChats').doc(selectedUser.uid).set({
      [combinedId]: userChatData(selectedUser, currentUser)
    }, { merge: true });
    
  } catch (error) {
    showMessage({
      message: `Error: ${error.message}`,
      type: 'danger',
    });
  }
};
