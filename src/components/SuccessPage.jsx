// src/components/SuccessPage.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePayment } from '../contexts/PaymentContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { CheckCircle } from 'lucide-react';
import { updateSubscriptionStatus } from '../services/paymentService';

const SuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setIsPremium } = usePayment();

    useEffect(() => {
        const handleSuccess = async () => {
            const userId = searchParams.get('userId');
            if (userId) {
                try {
                    // Update subscription status in Firebase
                    await updateSubscriptionStatus(userId, 'active');
                    // Update local state
                    setIsPremium(true);
                } catch (error) {
                    console.error('Error updating subscription status:', error);
                }
            }

            // Redirect after 5 seconds
            const timer = setTimeout(() => {
                navigate('/');
            }, 5000);

            return () => clearTimeout(timer);
        };

        handleSuccess();
    }, [navigate, setIsPremium, searchParams]);

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
                        Redirecting you back to the application...
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SuccessPage;