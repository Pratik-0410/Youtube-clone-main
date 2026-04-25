import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ UPDATED
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB205kNakiTO6HN2uKzbtq_9OdDVInVAd8",
  authDomain: "clone-5c6d5.firebaseapp.com",
  projectId: "clone-5c6d5",
  storageBucket: "clone-5c6d5.firebasestorage.app",
  messagingSenderId: "154319460854",
  appId: "1:154319460854:web:d8e195c4197197bf358fd7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider(); // ✅ ADDED