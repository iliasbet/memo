import mongoose from 'mongoose';

// Define the cache interface
interface MongooseCache {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
}

// Declare the global mongoose cache
declare global {
    var mongoose: MongooseCache;
}

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
}

// Initialize cache if it doesn't exist
if (!global.mongoose) {
    global.mongoose = {
        conn: null,
        promise: null
    };
}

// Use the initialized cache
const cached = global.mongoose;

async function connectDB(): Promise<mongoose.Connection> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts)
            .then(mongoose => mongoose.connection);
    }

    try {
        const conn = await cached.promise;
        cached.conn = conn;
        return conn;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
}

export default connectDB; 