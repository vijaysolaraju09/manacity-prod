// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnArPsa8xi8aB9-aCjENcXA09sgjFvCy4",
  authDomain: "mana-city-98fa0.firebaseapp.com",
  projectId: "mana-city-98fa0",
  storageBucket: "mana-city-98fa0.appspot.com",
  messagingSenderId: "1011241089335",
  appId: "1:1011241089335:web:2ba85628781c7af1f502b2",
  measurementId: "G-JMXQCQ7FC8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
