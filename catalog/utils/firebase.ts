// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCT6AwjQRcMwfhkDG-BRKADnpBUVTI_AiA",
  authDomain: "sapna-shri-jewellers.firebaseapp.com",
  projectId: "sapna-shri-jewellers",
  storageBucket: "sapna-shri-jewellers.firebasestorage.app",
  messagingSenderId: "99915339320",
  appId: "1:99915339320:web:9c1d958732e1ed498d38cd",
  measurementId: "G-93YXKJV18B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);