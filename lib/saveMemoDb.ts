import { MongoClient } from 'mongodb';
import { Memo } from '@/types'; // Assurez-vous que ce type existe ou remplacez-le par un objet générique

const uri = process.env.MONGODB_URI || "mongodb+srv://joshua87000:Joshua87@gene.uxnovlm.mongodb.net/Memo?retryWrites=true&w=majority";

export async function saveMemoToDatabase(memo: Memo): Promise<string> {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

    try {
        console.log("Tentative de connexion à MongoDB...");
        await client.connect(); // Établit la connexion
        console.log("Connexion réussie à MongoDB.");

        const db = client.db('Memo'); // Nom de la base de données
        const collection = db.collection('MemoCreated'); // Nom de la collection

        const result = await collection.insertOne(memo); // Insère le mémo
        console.log("Mémo sauvegardé avec succès :", result.insertedId);

        return result.insertedId.toString(); // Retourne l'ID inséré
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du mémo :', error);
        throw error; // Lève l'erreur pour que l'appelant puisse la gérer
    } finally {
        await client.close(); // Ferme la connexion après l'opération
        console.log("Connexion MongoDB fermée.");
    }
}
