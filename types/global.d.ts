import { MongoClient } from 'mongodb';

declare global {
    namespace NodeJS {
        interface Global {
            _mongoClientPromise?: Promise<MongoClient>;
        }
    }
}

// Ajoutez cette ligne pour éviter que TypeScript ne traite ce fichier comme un module :
export { };
