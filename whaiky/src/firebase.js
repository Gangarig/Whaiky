import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyB8PHlBy4ied1kY7IM7dm-bpDwQKfz5lC8",
  authDomain: "whaiky-538ca.firebaseapp.com",
  projectId: "whaiky-538ca",
  storageBucket: "whaiky-538ca.appspot.com",
  messagingSenderId: "454465463090",
  appId: "1:454465463090:web:b6192fba0a10b285e22d2b",
  measurementId: "G-8ZBDEQJNQJ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
