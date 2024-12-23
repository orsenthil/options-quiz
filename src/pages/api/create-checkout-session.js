import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId, priceId } = req.body;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/`,
            metadata: {
                userId,
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating checkout session' });
    }
}