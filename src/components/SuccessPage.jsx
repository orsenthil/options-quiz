// src/components/SuccessPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../contexts/PaymentContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
    const navigate = useNavigate();
    const { setIsPremium } = usePayment();

    useEffect(() => {
        setIsPremium(true);

        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate, setIsPremium]);

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