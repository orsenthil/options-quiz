// src/components/PaymentGateway.jsx
// src/components/PaymentGateway.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../services/stripeService';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader } from 'lucide-react';

const PaymentGateway = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {
        if (!user) {
            setError('Please sign in to continue');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Log environment variables (for debugging)
            console.log('Price ID:', import.meta.env.VITE_STRIPE_PRICE_ID);

            await createCheckoutSession(
                user.uid,
                user.email
            );
        } catch (error) {
            console.error('Payment error:', error);
            setError(error.message || 'Unable to initiate checkout. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Upgrade to Premium Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-medium">Premium Features Include:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Access to All Advanced Options Strategies</li>
                            <li>Detailed Strategy-Specific Practice Scenarios</li>
                            <li>Easily get the value for your money by practicing scenarios.</li>
                            <li>One time Payment. Lifetime Subscription.</li>
                        </ul>
                    </div>

                    <div className="text-center py-4">
                        <span className="text-3xl font-bold">$4.99</span>
                        <span className="text-gray-500 ml-2">one-time payment</span>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="bg-red-50">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        onClick={handlePayment}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Upgrade Now'
                        )}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                        Secure payment powered by Stripe
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentGateway;