// src/contexts/PaymentContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { checkSubscriptionStatus } from '../services/paymentService';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            if (user) {
                try {
                    // First check local storage
                    const cachedStatus = localStorage.getItem(`premium_status_${user.uid}`);
                    if (cachedStatus) {
                        const { isPremium: cachedPremium, timestamp } = JSON.parse(cachedStatus);
                        // Check if cache is less than 1 hour old
                        if (Date.now() - timestamp < 3600000) {
                            setIsPremium(cachedPremium);
                            setLoading(false);
                            return;
                        }
                    }

                    // If no valid cache, check Firestore
                    const status = await checkSubscriptionStatus(user.uid);
                    setIsPremium(status.isPremium);

                    // Update cache
                    localStorage.setItem(`premium_status_${user.uid}`, JSON.stringify({
                        isPremium: status.isPremium,
                        timestamp: Date.now()
                    }));
                } catch (error) {
                    console.error('Error checking subscription status:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setIsPremium(false);
                setLoading(false);
            }
        };

        checkStatus();
    }, [user]);

    const updatePremiumStatus = (newStatus) => {
        setIsPremium(newStatus);
        if (user) {
            localStorage.setItem(`premium_status_${user.uid}`, JSON.stringify({
                isPremium: newStatus,
                timestamp: Date.now()
            }));
        }
    };

    const value = {
        isPremium,
        setIsPremium: updatePremiumStatus,
        loading
    };

    return (
        <PaymentContext.Provider value={value}>
            {!loading && children}
        </PaymentContext.Provider>
    );
};