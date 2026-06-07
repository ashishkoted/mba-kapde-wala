import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCD8UACuGM5OwEn3OdEyXFx-e4Bb0voUMk",
  authDomain: "bankorala.firebaseapp.com",
  projectId: "bankorala",
  storageBucket: "bankorala.firebasestorage.app",
  messagingSenderId: "1032659377172",
  appId: "1:1032659377172:web:fff5cc10fe6598789ddb01",
  measurementId: "G-81BKTE6PBM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);