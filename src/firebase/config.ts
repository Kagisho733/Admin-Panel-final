import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getAuth} from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyBkUzClefK_Q7Ld3nEn_AK7s_VeYuqzoSQ",
  authDomain: "books-bots-drones-f6fb0.firebaseapp.com",
  projectId: "books-bots-drones-f6fb0",
  storageBucket: "books-bots-drones-f6fb0.firebasestorage.app",
  messagingSenderId: "1018136992194",
  appId: "1:1018136992194:web:817361604529ba7de41e5b",
  measurementId: "G-D4CJ9KSV62"
};



const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);