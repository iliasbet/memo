import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const useStripe = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const redirectToCheckout = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const { sessionId } = await response.json();
            const stripe = await stripePromise;

            const { error } = await stripe!.redirectToCheckout({
                sessionId,
            });

            if (error) {
                setError(error.message || 'Une erreur est survenue');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la redirection vers le paiement');
            console.error('Erreur Stripe:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        redirectToCheckout,
        isLoading,
        error,
    };
}; 