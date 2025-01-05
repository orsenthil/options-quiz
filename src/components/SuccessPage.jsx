// src/components/SuccessPage.jsx
// src/components/SuccessPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { CheckCircle } from 'lucide-react';
import { updateSubscriptionStatus } from '../services/paymentService';

const SuccessPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { setIsPremium } = usePayment();

    useEffect(() => {
        const handleSuccess = async () => {
            if (user) {
                try {
                    // Update subscription status in Firebase
                    await updateSubscriptionStatus(user.uid, 'active');

                    // Update local state
                    setIsPremium(true);

                    // Store in localStorage for persistence
                    localStorage.setItem(`premium_status_${user.uid}`, JSON.stringify({
                        isPremium: true,
                        timestamp: Date.now()
                    }));
                } catch (error) {
                    console.error('Error updating subscription status:', error);
                }
            }

            // Redirect after 3 seconds
            const timer = setTimeout(() => {
                navigate('/');
            }, 3000);

            return () => clearTimeout(timer);
        };

        handleSuccess();
    }, [navigate, setIsPremium, user]);

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="text-center">
                        Payment Successful!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-gray-600">
                        Thank you for upgrading to premium access. You now have access to all advanced options trading strategies.
                    </p>
                    <p className="text-sm text-center text-gray-500">
                        Redirecting you back to the application in a few seconds...
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SuccessPage;