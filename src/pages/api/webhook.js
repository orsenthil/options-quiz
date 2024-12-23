import Stripe from 'stripe';
import { buffer } from 'micro';
import { updateSubscriptionStatus } from '../../services/paymentService';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
const webhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata.userId;
            await updateSubscriptionStatus(userId, 'active');
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
}