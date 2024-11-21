// const { MongoClient } = require('mongodb');

// const uri = process.env.MONGODB_URI || "mongodb+srv://joshua87000:Joshua87@gene.uxnovlm.mongodb.net/Memo?retryWrites=true&w=majority";

// let client;
// let clientPromise;

// if (process.env.NODE_ENV === 'development') {
//     // Utilisez une connexion globale en développement pour éviter les reconnections
//     if (!global._mongoClientPromise) {
//         client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
//         global._mongoClientPromise = client.connect();
//     }
//     clientPromise = global._mongoClientPromise;
// } else {
//     // En production, créez une nouvelle connexion à chaque démarrage
//     client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
//     clientPromise = client.connect();
// }

// module.exports = clientPromise;
