import { initializeApp } from "firebase/app";
import { getFirestore } from  'firebase/firestore';
import { getAuth } from  'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBEuOsBDd8zPv1rglbVL-0My3bM1RFLT_c",
  authDomain: "linktree-e6778.firebaseapp.com",
  projectId: "linktree-e6778",
  storageBucket: "linktree-e6778.firebasestorage.app",
  messagingSenderId: "216986720316",
  appId: "1:216986720316:web:d40000996e9b6421c08b39"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }