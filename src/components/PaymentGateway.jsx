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
            const session = await createCheckoutSession(user.uid);
            window.location.href = session.url;
        } catch (error) {
            console.error('Payment error:', error);
            setError('Unable to process payment. Please try again.');
        } finally {
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
                            <li>Access to Advanced Options Strategies</li>
                            <li>Lifetime Access for Practice</li>
                            <li>One time Payment</li>
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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