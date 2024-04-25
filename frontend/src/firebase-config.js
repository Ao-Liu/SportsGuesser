import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKArJcWGegjBK1I99VGZazw7fXeFrX-j8",
  authDomain: "sports-4c1e0.firebaseapp.com",
  projectId: "sports-4c1e0",
  storageBucket: "sports-4c1e0.appspot.com",
  messagingSenderId: "811199037226",
  appId: "1:811199037226:web:266314453913986168a853",
  measurementId: "G-F0PQQR88N4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Obtain the auth service instance for the app

export { auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged };