import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBcuKYAMAx7dvTiPDFU9uwC7wpEN7c5t40",
    authDomain: "radioweb-12422.firebaseapp.com",
    projectId: "radioweb-12422",
    storageBucket: "radioweb-12422.appspot.com",
    messagingSenderId: "37763249961",
    appId: "1:37763249961:web:"
};

// Inicializa o Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
