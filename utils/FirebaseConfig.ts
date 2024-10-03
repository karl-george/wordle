import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FB_KEY!,
  authDomain: 'wordle-clone-e4456.firebaseapp.com',
  projectId: 'wordle-clone-e4456',
  storageBucket: 'wordle-clone-e4456.appspot.com',
  messagingSenderId: '198140919462',
  appId: '1:198140919462:web:c7aed6011a184d4420fe67',
};

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app);
