// Import the functions you need from the SDKs you need
// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFjW2ExpOXFA0rgmzA9oOBvnquWRCRw7E",
  authDomain: "collabkart-38c19.firebaseapp.com",
  projectId: "collabkart-38c19",
  storageBucket: "collabkart-38c19.appspot.com", // 🔧 fixed `.app` to `.appspot.com`
  messagingSenderId: "166066053132",
  appId: "1:166066053132:web:bd68ff0b665003336cce29",
  measurementId: "G-4PRBD42BNN"
};

const app = initializeApp(firebaseConfig);

// ✅ Core services you’ll use
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
