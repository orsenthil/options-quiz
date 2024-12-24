import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const createCheckoutSession = async (userId, userEmail) => {
    try {
        const stripe = await stripePromise;

        const { error } = await stripe.redirectToCheckout({
            lineItems: [
                {
                    price: import.meta.env.VITE_STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            successUrl: `${window.location.origin}/success?userId=${userId}`,
            cancelUrl: `${window.location.origin}/`,
            customerEmail: userEmail, // Pre-fill customer email if available
        });

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error initiating checkout:', error);
        throw error;
    }
};