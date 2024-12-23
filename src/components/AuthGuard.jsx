// src/components/AuthGuard.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import PaymentGateway from './PaymentGateway'; // Now this import will work

const AuthGuard = ({ children, requiresPremium = false }) => {
    const { user, signInWithGoogle } = useAuth();
    const { isPremium } = usePayment();

    if (!user) {
        return (
            <Card className="max-w-md mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Sign in Required</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-4">
                        Please sign in to access this feature.
                    </p>
                    <Button
                        onClick={() => signInWithGoogle()}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (requiresPremium && !isPremium) {
        return <PaymentGateway />;
    }

    return children;
};

export default AuthGuard;