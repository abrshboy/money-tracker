
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCtqRIrD5geNw-UeRNVkIp68YBTM5FsX88",
  authDomain: "money-2ee00.firebaseapp.com",
  projectId: "money-2ee00",
  storageBucket: "money-2ee00.firebasestorage.app",
  messagingSenderId: "845602478846",
  appId: "1:845602478846:web:0afac0c6f6eb5280d523af",
  measurementId: "G-LC1Z1X4P74"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Enable offline persistence for better mobile experience
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn("Firestore persistence failed: Multiple tabs open.");
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn("Firestore persistence failed: Browser not supported.");
    }
  });
}
