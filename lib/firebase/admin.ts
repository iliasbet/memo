import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Type pour les variables d'environnement requises
type RequiredEnvVars = {
    projectId: string;
    clientEmail: string;
    privateKey: string;
};

// Fonction pour vérifier si une variable d'environnement est définie
function assertEnvVar(value: string | undefined, name: string): string {
    if (!value) {
        throw new Error(`La variable d'environnement ${name} n'est pas définie`);
    }
    return value;
}

// Récupération et validation des variables d'environnement
const requiredEnvVars: RequiredEnvVars = {
    projectId: assertEnvVar(process.env.FIREBASE_ADMIN_PROJECT_ID, 'FIREBASE_PROJECT_ID'),
    clientEmail: assertEnvVar(process.env.FIREBASE_ADMIN_CLIENT_EMAIL, 'FIREBASE_CLIENT_EMAIL'),
    privateKey: assertEnvVar(process.env.FIREBASE_ADMIN_PRIVATE_KEY, 'FIREBASE_PRIVATE_KEY'),
};

// Initialisation de Firebase Admin
let adminApp;

if (!getApps().length) {
    try {
        adminApp = initializeApp({
            credential: cert({
                projectId: requiredEnvVars.projectId,
                clientEmail: requiredEnvVars.clientEmail,
                privateKey: requiredEnvVars.privateKey.replace(/\\n/g, '\n')
            })
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de Firebase Admin:', error);
        throw error;
    }
} else {
    adminApp = getApps()[0];
}

const adminAuth = getAuth(adminApp);

export { adminAuth };