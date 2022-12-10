import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, setDoc, doc, updateDoc, arrayUnion, onSnapshot, getDoc, increment, arrayRemove, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbMU35FfyxF_ReNWFidZcGZNisA0v1E18",
  authDomain: "docer-c8dba.firebaseapp.com",
  projectId: "docer-c8dba",
  storageBucket: "docer-c8dba.appspot.com",
  messagingSenderId: "271719760711",
  appId: "1:271719760711:web:9272c6b11d9d5265ce8262",
  measurementId: "G-PJ184MCL0L"
};

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

db.collection("users").add({
    first: "Lorenz",
    last: "Marqueses",
    type: 0 // 0: student; 1: teacher
})
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});
