import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const createCheckoutSession = async (userId, userEmail) => {
    try {
        const stripe = await stripePromise;

        const { error } = await stripe.redirectToCheckout({
            lineItems: [
                {
                    // Make sure this is your price ID, not product ID
                    price: import.meta.env.VITE_STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            successUrl: `${window.location.origin}/success?userId=${userId}`,
            cancelUrl: `${window.location.origin}/`,
            customerEmail: userEmail,
        });

        if (error) {
            console.error('Stripe error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error initiating checkout:', error);
        throw error;
    }
};