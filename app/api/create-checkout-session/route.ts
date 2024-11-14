import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-10-28.acacia'
});

export async function POST() {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (err) {
        console.error('Erreur création session Stripe:', err);
        return NextResponse.json(
            { error: 'Erreur lors de la création de la session de paiement' },
            { status: 500 }
        );
    }
} 