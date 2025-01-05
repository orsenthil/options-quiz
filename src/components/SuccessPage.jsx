// src/components/SuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { updateSubscriptionStatus } from '../services/paymentService';
import { Alert, AlertDescription } from "./ui/alert";

const SuccessPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { setIsPremium } = usePayment();
    const [error, setError] = useState(null);
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        const handleSuccess = async () => {
            console.log('SuccessPage: Starting payment success handling');
            console.log('Current user:', user?.uid);

            if (!user) {
                console.error('No user found in SuccessPage');
                setError('User not found. Please try logging in again.');
                return;
            }

            try {
                console.log('Updating subscription status in Firestore...');
                await updateSubscriptionStatus(user.uid, 'active');

                console.log('Setting premium status in context...');
                await setIsPremium(true);

                console.log('Updating localStorage...');
                localStorage.setItem(`premium_status_${user.uid}`, JSON.stringify({
                    isPremium: true,
                    timestamp: Date.now()
                }));

                setUpdated(true);
                console.log('All updates completed successfully');

                // Redirect after success
                setTimeout(() => {
                    console.log('Redirecting to home page...');
                    navigate('/');
                }, 3000);
            } catch (error) {
                console.error('Error in SuccessPage:', error);
                setError(error.message || 'Failed to update subscription status');
            }
        };

        handleSuccess();
    }, [navigate, setIsPremium, user]);

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        {error ? (
                            <AlertTriangle className="h-12 w-12 text-red-500" />
                        ) : (
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        )}
                    </div>
                    <CardTitle className="text-center">
                        {error ? 'Update Failed' : 'Payment Successful!'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error ? (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <p className="text-center text-gray-600">
                                Thank you for upgrading to premium access. You now have access to all advanced options trading strategies.
                            </p>
                            <p className="text-sm text-center text-gray-500">
                                {updated ? 'Premium status updated successfully! ' : ''}
                                Redirecting you back to the application in a few seconds...
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SuccessPage;