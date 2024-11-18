import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Retourner des données de test pour l'instant
        return NextResponse.json({
            collections: [],
            folders: []
        });
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        // Simuler une création réussie
        return NextResponse.json({
            id: '1',
            name: 'Nouvelle collection',
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
} 