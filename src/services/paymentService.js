// src/services/paymentService.js
import { db } from '../firebase/config';
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';

export const checkSubscriptionStatus = async (userId) => {
    console.log('Checking subscription status for userId:', userId);

    try {
        const userDoc = await getDoc(doc(db, 'subscriptions', userId));
        console.log('Firestore subscription data:', userDoc.data());

        if (!userDoc.exists()) {
            console.log('No subscription document found');
            return { isPremium: false };
        }

        const data = userDoc.data();
        const isActive = data.status === 'active';
        console.log('Subscription status:', { isActive, status: data.status });

        return { isPremium: isActive };
    } catch (error) {
        console.error('Error checking subscription:', error);
        throw error;
    }
};

export const updateSubscriptionStatus = async (userId, status) => {
    console.log('Updating subscription status:', { userId, status });

    try {
        const docRef = doc(db, 'subscriptions', userId);
        const data = {
            status,
            updatedAt: serverTimestamp()
        };

        await setDoc(docRef, data);
        console.log('Successfully updated subscription in Firestore');

        // Double-check the update
        const updatedDoc = await getDoc(docRef);
        console.log('Verified Firestore data:', updatedDoc.data());

        return true;
    } catch (error) {
        console.error('Error updating subscription status:', error);
        throw error;
    }
};