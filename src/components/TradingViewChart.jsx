// src/components/TradingViewChart.jsx
import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const TradingViewChart = ({ symbol }) => {
    const containerRef = useRef(null);
    const scriptRef = useRef(null);

    useEffect(() => {
        if (!symbol) return;

        // Clean up previous script if it exists
        if (scriptRef.current) {
            scriptRef.current.remove();
            scriptRef.current = null;
        }

        // Create and load the TradingView widget script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": `${symbol}`,
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "2",
            "locale": "en",
            "hide_legend": true,
            "range": "1M",
            "allow_symbol_change": false,
            "save_image": false,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
        });

        // Save reference to script for cleanup
        scriptRef.current = script;

        // Add script to container
        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        // Cleanup function
        return () => {
            if (scriptRef.current) {
                scriptRef.current.remove();
                scriptRef.current = null;
            }
        };
    }, [symbol]); // Re-run effect when symbol changes

    if (!symbol) return null;

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="text-sm font-medium">
                    {symbol} Price Chart
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-96">
                    <div
                        ref={containerRef}
                        className="tradingview-widget-container w-full h-full"
                    >
                        <div
                            className="tradingview-widget-container__widget"
                            style={{ height: 'calc(100% - 32px)', width: '100%' }}
                        />
                        <div className="tradingview-widget-copyright">
                            <a
                                href="https://www.tradingview.com/"
                                rel="noopener nofollow"
                                target="_blank"
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Track all markets on TradingView
                            </a>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TradingViewChart;