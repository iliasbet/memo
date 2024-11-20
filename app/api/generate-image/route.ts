
// app/api/generate-image/route.ts
import { NextResponse } from 'next/server';
//import { generateImage } from '@/lib/memoGeneration';
import { Logger, LogLevel } from '@/lib/logger';
import { MemoContext } from '@/types';

/*
export async function POST(request: Request) {
    try {
        const { topic } = await request.json();

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic is required' },
                { status: 400 }
            );
        }

        const context: MemoContext = {
            topic,
            objective: topic
        };

        const imageUrl = await generateImage(topic, context);

        if (!imageUrl) {
            return NextResponse.json(
                { error: 'Failed to generate image' },
                { status: 500 }
            );
        }

        return NextResponse.json({ imageUrl });
    } catch (error) {
        Logger.log(LogLevel.ERROR, 'Error in generate-image API:', { error });
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}*/