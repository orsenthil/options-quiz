import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../services/paymentService';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const PaymentGateway = () => {
    const { user } = useAuth();

    const handleSubscribe = async () => {
        if (!user) {
            alert('Please sign in to subscribe');
            return;
        }

        try {
            const session = await createCheckoutSession(user.uid);
            window.location.href = session.url;
        } catch (error) {
            console.error('Error initiating checkout:', error);
            alert('Error initiating checkout. Please try again.');
        }
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Upgrade to Premium</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <h3 className="font-medium">Premium Features Include:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Access to advanced options strategies</li>
                        <li>Additional practice scenarios</li>
                        <li>Detailed performance analytics</li>
                    </ul>
                </div>
                <div className="text-center">
                    <span className="text-3xl font-bold">$49.99</span>
                    <span className="text-gray-500 ml-2">one-time payment</span>
                </div>
                <Button
                    onClick={handleSubscribe}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    Upgrade Now
                </Button>
            </CardContent>
        </Card>
    );
};