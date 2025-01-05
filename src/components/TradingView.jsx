// src/components/TradingView.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ExternalLink } from 'lucide-react';

const TradingView = ({ symbol }) => {
    if (!symbol) {
        return null;
    }

    const tradingViewUrl = `https://www.tradingview.com/symbols/${symbol}/`;

    return (
        <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Technical Analysis
                </CardTitle>
                <a
                    href={tradingViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                    View on TradingView
                    <ExternalLink className="h-4 w-4" />
                </a>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-gray-500">
                    Click the link above to view detailed technical analysis, charts, and indicators for {symbol} on TradingView.
                </div>
            </CardContent>
        </Card>
    );
};

export default TradingView;