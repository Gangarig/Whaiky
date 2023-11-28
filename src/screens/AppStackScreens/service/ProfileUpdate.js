import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

export const handleUpdate = async (currentUser, userInfo, userLocation, locationChanged) => {
  if (currentUser?.uid) {
    try {
      const updatedUserData = {
        firstName: userInfo.firstName || null,
        lastName: userInfo.lastName || null,
        displayName: userInfo.displayName || null,
        phoneNumbers: userInfo.phoneNumbers || null,
      };
      
      if (locationChanged) {
        updatedUserData.country = userLocation.country || null;
        updatedUserData.state = userLocation.state || null;
        updatedUserData.city = userLocation.city || null;
      }

      await firestore().collection('users').doc(currentUser.uid).update(updatedUserData);

      showMessage({
        message: 'Information updated successfully!',
        type: 'success',
      });

    } catch (error) {
      showMessage({
        message: 'Error updating information: ' + error.message,
        type: 'danger',
      });
    }
  }
};
