import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
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
            successUrl: `${window.location.origin}${import.meta.env.BASE_URL}#/success?userId=${userId}`, // Updated URL format
            cancelUrl: `${window.location.origin}${import.meta.env.BASE_URL}`,
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