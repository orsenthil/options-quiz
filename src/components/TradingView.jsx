// src/components/TradingView.jsx
import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const TradingView = ({ symbol }) => {
    const container = useRef(null);
    const scriptRef = useRef(null);

    useEffect(() => {
        if (!symbol) return;

        // Remove any existing script
        if (scriptRef.current) {
            scriptRef.current.remove();
        }

        // Create new script element
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "interval": "1W",
            "width": "100%",
            "isTransparent": false,
            "height": "400",
            "symbol": `${symbol}`,
            "showIntervalTabs": true,
            "displayMode": "single",
            "locale": "en",
            "colorTheme": "light"
        });

        // Save reference to script
        scriptRef.current = script;

        // Add script to container
        if (container.current) {
            container.current.appendChild(script);
        }

        // Cleanup
        return () => {
            if (scriptRef.current) {
                scriptRef.current.remove();
            }
        };
    }, [symbol]);

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
                <div className="tradingview-widget-container" ref={container}>
                    <div className="tradingview-widget-container__widget"></div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TradingView;