import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFjW2ExpOXFA0rgmzA9oOBvnquWRCRw7E",
  authDomain: "collabkart-38c19.firebaseapp.com",
  projectId: "collabkart-38c19",
  storageBucket: "collabkart-38c19.appspot.com",
  messagingSenderId: "166066053132",
  appId: "1:166066053132:web:bd68ff0b665003336cce29",
  measurementId: "G-4PRBD42BNN"
};

// Initialize Firebase only if no apps initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
