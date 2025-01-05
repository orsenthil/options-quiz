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
            console.log('PaymentContext: Checking status, current user:', user?.uid);

            if (user) {
                try {
                    // Check local storage first
                    const storageKey = `premium_status_${user.uid}`;
                    console.log('Checking localStorage with key:', storageKey);

                    const cachedStatus = localStorage.getItem(storageKey);
                    console.log('Cached status found:', cachedStatus);

                    if (cachedStatus) {
                        const parsed = JSON.parse(cachedStatus);
                        console.log('Parsed cached status:', parsed);

                        if (Date.now() - parsed.timestamp < 3600000) {
                            console.log('Using cached premium status:', parsed.isPremium);
                            setIsPremium(parsed.isPremium);
                            setLoading(false);
                            return;
                        } else {
                            console.log('Cache expired, checking Firestore');
                        }
                    }

                    // Check Firestore
                    const status = await checkSubscriptionStatus(user.uid);
                    console.log('Firestore status result:', status);

                    setIsPremium(status.isPremium);
                    console.log('Updated isPremium state to:', status.isPremium);

                    // Update cache
                    const newCacheData = {
                        isPremium: status.isPremium,
                        timestamp: Date.now()
                    };
                    localStorage.setItem(storageKey, JSON.stringify(newCacheData));
                    console.log('Updated localStorage cache:', newCacheData);

                } catch (error) {
                    console.error('Error in PaymentContext:', error);
                }
            } else {
                console.log('No user found, setting isPremium to false');
                setIsPremium(false);
            }

            setLoading(false);
        };

        checkStatus();
    }, [user]);

    const updatePremiumStatus = async (newStatus) => {
        console.log('Updating premium status to:', newStatus);

        setIsPremium(newStatus);

        if (user) {
            const cacheData = {
                isPremium: newStatus,
                timestamp: Date.now()
            };
            const storageKey = `premium_status_${user.uid}`;

            localStorage.setItem(storageKey, JSON.stringify(cacheData));
            console.log('Updated cache in updatePremiumStatus:', cacheData);
        }
    };

    console.log('PaymentContext current state:', { isPremium, loading });

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