
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCI27hyITwFfFLtZYupjVnYjdVxu_gvZkg",
  authDomain: "whaiky-f9e40.firebaseapp.com",
  databaseURL: "https://whaiky-f9e40-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "whaiky-f9e40",
  storageBucket: "whaiky-f9e40.appspot.com",
  messagingSenderId: "1082121859527",
  appId: "1:1082121859527:web:db8000790f646699d469e2",
  measurementId: "G-DQ73XHBNJK"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const firestore = getFirestore(app);
 const db = getDatabase(app);
 const storage = getStorage(app);
 export { auth, firestore, db, storage };
