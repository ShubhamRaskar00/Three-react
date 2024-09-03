import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAAhMlEy2AOZzvABD6UOHOvpLTHMmq7R0",
  authDomain: "rent-product-6e0ee.firebaseapp.com",
  projectId: "rent-product-6e0ee",
  storageBucket: "rent-product-6e0ee.appspot.com",
  messagingSenderId: "427025797313",
  appId: "1:427025797313:web:3c050b7582a05080648440",
  measurementId: "G-P6KQ6P0SYS",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };
