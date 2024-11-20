import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC7kp3t8BylrI7LU0rgCVpOdP8Vl-Az0AA",
    authDomain: "memo-40bd1.firebaseapp.com",
    projectId: "memo-40bd1",
    storageBucket: "memo-40bd1.firebasestorage.app",
    messagingSenderId: "328208650824",
    appId: "1:328208650824:web:5203e51a31dd5080f5be7d"
};

// Vérification des variables d'environnement
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error('Configuration Firebase manquante ou incomplète');
    throw new Error('Configuration Firebase manquante ou incomplète');
}

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
