import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

export const updateProfile =  (uid, data) => {
  try {
    firestore().collection('users').doc(uid).update(data);
    showMessage({ message: 'Profile updated', type: 'success' });
  } catch (error) {
    console.error('Error updating profile', error);
    showMessage({ message: 'Error updating profile', type: 'danger' });
  }
}
