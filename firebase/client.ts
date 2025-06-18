import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkvdGPetJ7k66-QRfYYlGlNdWXhCAuCxg",
  authDomain: "prepwise-83d13.firebaseapp.com",
  projectId: "prepwise-83d13",
  storageBucket: "prepwise-83d13.firebasestorage.app",
  messagingSenderId: "124702428283",
  appId: "1:124702428283:web:5c5b01476f1801aa44e6de",
  measurementId: "G-H2VTC1PPK3"
};

const app = !getApps.length ? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
