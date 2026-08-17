import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Credenciales corregidas para delgadowebs-firebase
const firebaseConfig = {
  apiKey: "AIzaSyAHHkzTkVbiLAO9OQs7y6GYZCcSTuc768c",
  authDomain: "delgadowebs-firebase.firebaseapp.com",
  projectId: "delgadowebs-firebase",
  storageBucket: "delgadowebs-firebase.firebasestorage.app",
  messagingSenderId: "401940367025",
  appId: "1:401940367025:web:eb07b0b5277117aeb54490"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la base de datos Firestore
export const db = getFirestore(app);