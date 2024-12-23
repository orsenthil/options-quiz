const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID;

export const createCheckoutSession = async (userId) => {
    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                priceId: STRIPE_PRICE_ID
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const session = await response.json();
        return session;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};
