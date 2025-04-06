import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAyZfT_gGH59MgdC5vPtoxvT_V9ZrAf5_Y",
  authDomain: "anime-tracker-app.firebaseapp.com",
  databaseURL: "https://anime-tracker-app-default-rtdb.firebaseio.com",
  projectId: "anime-tracker-app",
  storageBucket: "anime-tracker-app.appspot.com",
  messagingSenderId: "686739565401",
  appId: "1:686739565401:web:3991eaca4e86ee3ad4fa48",
  measurementId: "G-ZGJNTD8MSD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // ✅ Correct usage
});

// Initialize Realtime Database
const db = getDatabase(app);

export { app, auth, db };