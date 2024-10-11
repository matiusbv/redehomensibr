import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyAeRONMaHC193ga_RlbortKmUbaBF_T4gQ",
  authDomain: "rededehomens.firebaseapp.com",
  projectId: "rededehomens",
  storageBucket: "rededehomens.appspot.com",
  messagingSenderId: "959004846660",
  appId: "1:959004846660:web:599fb33eaab5d40903aa11",
  measurementId: "G-T054LSP72P"
};

const firebaseapp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseapp);
const auth = getAuth(firebaseapp) 

export { db, auth };