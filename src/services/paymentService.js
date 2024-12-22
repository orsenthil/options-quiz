// src/services/paymentService.js
import { db } from '../firebase/config';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';

export const checkSubscriptionStatus = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'subscriptions', userId));
        return {
            isPremium: userDoc.exists() && userDoc.data().status === 'active'
        };
    } catch (error) {
        console.error('Error checking subscription:', error);
        throw error;
    }
};

export const createCheckoutSession = async (userId) => {
    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                priceId: 'your_stripe_price_id' // You'll need to replace this with your actual Stripe price ID
            }),
        });

        const session = await response.json();
        return session;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};

export const updateSubscriptionStatus = async (userId, status) => {
    try {
        await setDoc(doc(db, 'subscriptions', userId), {
            status,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating subscription status:', error);
        throw error;
    }
};