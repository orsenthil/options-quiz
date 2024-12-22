// api/webhook.js
import Stripe from 'stripe';
import { buffer } from 'micro';
import { updateSubscriptionStatus } from '../../services/paymentService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

    let event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;

        try {
            await updateSubscriptionStatus(userId, 'active');
        } catch (error) {
            console.error('Error updating subscription status:', error);
            return res.status(500).json({ message: 'Error updating subscription status' });
        }
    }

    res.json({ received: true });
}