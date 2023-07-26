import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCI27hyITwFfFLtZYupjVnYjdVxu_gvZkg",
  authDomain: "whaiky-f9e40.firebaseapp.com",
  projectId: "whaiky-f9e40",
  storageBucket: "whaiky-f9e40.appspot.com",
  messagingSenderId: "1082121859527",
  appId: "1:1082121859527:web:db8000790f646699d469e2",
  measurementId: "G-DQ73XHBNJK"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
