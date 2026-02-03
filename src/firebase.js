import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUODTvcyWV3wXv9ZsYVWh-2Sz5ZKAEL5U",
  authDomain: "file-system-628de.firebaseapp.com",
  projectId: "file-system-628de",
  storageBucket: "file-system-628de.firebasestorage.app",
  messagingSenderId: "171409128542",
  appId: "1:171409128542:web:f05d4eb18e266d61dd88cf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
