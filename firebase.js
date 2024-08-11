import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCa81oLbcV0hMmVhW-gN49d3Xu5Ya-cT6M",
  authDomain: "pantry-tracker-1912.firebaseapp.com",
  projectId: "pantry-tracker-1912",
  storageBucket: "pantry-tracker-1912.appspot.com",
  messagingSenderId: "686308546977",
  appId: "1:686308546977:web:5947a2e94a039d5abfd3e0",
  measurementId: "G-760X0NZWFQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
