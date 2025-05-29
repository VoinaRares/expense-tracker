import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


export const firebaseConfig = {
  apiKey: "AIzaSyD6vwqTX1qMGHV4opVhYMr68BA73nsBIoE",
  authDomain: "expensetracker-ce751.firebaseapp.com",
  projectId: "expensetracker-ce751",
  storageBucket: "expensetracker-ce751.firebasestorage.app",
  messagingSenderId: "1045233442032",
  appId: "1:1045233442032:web:dcaf0f87c9cfb3bc807635",
  measurementId: "G-XE8PW6BXDT",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
