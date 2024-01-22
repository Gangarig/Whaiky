import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '1082121859527-b9t7vui6gp4gj6871i2op86eoi6bt751.apps.googleusercontent.com',
});

const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential.user;

    // Check if the user already exists in Firestore
    const userDocRef = firestore().collection('users').doc(user.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      // User does not exist, create a new document in Firestore
      // Make sure to initialize all the fields you are tracking
      await userDocRef.set({
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        email: user.email,
        timeStamp: new Date().getTime(),
        photoURL: user.photoURL || '',
        status: 'user',
        // Initialize other fields as needed
      });
      showMessage({ message: 'Account created and signed in with Google successfully!', type: 'success' });
    } else {
      showMessage({ message: 'Signed in with Google successfully!', type: 'success' });
    }

  } catch (error) {
    showMessage({ message: `Error: ${error.message}`, type: 'danger' });
    console.error(error);
  }
};

export default signInWithGoogle;

