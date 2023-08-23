import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCI27hyITwFfFLtZYupjVnYjdVxu_gvZkg",
    authDomain: "whaiky-f9e40.firebaseapp.com",
    projectId: "whaiky-f9e40",
    storageBucket: "whaiky-f9e40.appspot.com",
    messagingSenderId: "1082121859527",
    appId: "1:1082121859527:web:db8000790f646699d469e2",
    measurementId: "G-DQ73XHBNJK"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
