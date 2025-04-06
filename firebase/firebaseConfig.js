import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "Api",
  authDomain: "anime-tracker-app.firebaseapp.com",
  databaseURL: "https://anime-tracker-app-default-rtdb.firebaseio.com",
  projectId: "anime-tracker-app",
  storageBucket: "anime-tracker-app.appspot.com",
  messagingSenderId: "686739565401",
  appId: "",
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
