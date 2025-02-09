import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
// import { db, collection, addDoc} from "../firebaseconfig/config.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot  } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_DgbNdxLE_94bWNmiq8CI0l9z-VhXc64",
  authDomain: "fir-auth-b2b80.firebaseapp.com",
  projectId: "fir-auth-b2b80",
  storageBucket: "fir-auth-b2b80.firebasestorage.app",
  messagingSenderId: "949915765799",
  appId: "1:949915765799:web:2b9d091646229849e8d202"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const db = getFirestore(app);
const db = getFirestore(app); // Firestore instance


export {app , auth, db, collection, addDoc};


