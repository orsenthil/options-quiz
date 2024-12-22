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

        if (!userDoc.exists()) {
            return { isPremium: false };
        }

        const data = userDoc.data();

        // Check if the user has an active subscription
        const isActive = data.status === 'active';

        // Store the subscription status in localStorage for persistence
        if (typeof window !== 'undefined') {
            localStorage.setItem('optionsTrainingPremium', JSON.stringify({
                isPremium: isActive,
                userId,
                lastChecked: new Date().toISOString()
            }));
        }

        return { isPremium: isActive };
    } catch (error) {
        console.error('Error checking subscription:', error);

        // Fallback to cached status if available
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('optionsTrainingPremium');
            if (cached) {
                const { isPremium, userId: cachedUserId } = JSON.parse(cached);
                if (userId === cachedUserId) {
                    return { isPremium };
                }
            }
        }

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