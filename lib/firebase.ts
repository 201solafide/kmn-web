// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Tambahkan ini di file firebase.ts
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAFCKyoJUC4zf6KdjLaXrEiqOUx8KChiFE",
    authDomain: "kmn-web-7adb1.firebaseapp.com",
    projectId: "kmn-web-7adb1",
    // storageBucket: "kmn-web-7adb1.firebasestorage.app",
    storageBucket: "kmn-web-7adb1.appspot.com",
    messagingSenderId: "940327013358",
    appId: "1:940327013358:web:6b165eeb2465363d1b5cff"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);