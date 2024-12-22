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
                    const status = await checkSubscriptionStatus(user.uid);
                    setIsPremium(status.isPremium);
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

    const value = {
        isPremium,
        setIsPremium,
        loading
    };

    return (
        <PaymentContext.Provider value={value}>
            {!loading && children}
        </PaymentContext.Provider>
    );
};