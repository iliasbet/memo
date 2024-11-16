import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Collection, Folder } from '@/models/Collection';
import { auth } from '@/lib/firebase-admin';

export async function GET(request: Request) {
    try {
        const token = request.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        await connectDB();

        const [collections, folders] = await Promise.all([
            Collection.find({ userId }),
            Folder.find({ userId })
        ]);

        return NextResponse.json({ collections, folders });
    } catch (error) {
        console.error('Erreur lors de la récupération des collections:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const token = request.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const { name, description, color, folderId } = await request.json();

        await connectDB();

        const collection = await Collection.create({
            name,
            description,
            color,
            userId,
            folderId,
            memos: []
        });

        return NextResponse.json(collection);
    } catch (error) {
        console.error('Erreur lors de la création de la collection:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
} 