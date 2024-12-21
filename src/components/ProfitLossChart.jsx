// src/components/ProfitLossChart.jsx
// src/components/ProfitLossChart.jsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer } from 'recharts';
import { STRATEGY_TYPES } from '../strategies/types';

const ProfitLossChart = ({ strikePrice, premium, currentPrice, strategy }) => {
    const generateChartData = useMemo(() => {
        const strike = parseFloat(strikePrice);
        const prem = parseFloat(premium);
        const entry = parseFloat(currentPrice);

        // Calculate price range
        let minPrice, maxPrice;
        if (strategy === STRATEGY_TYPES.COVERED_CALL) {
            minPrice = entry * 0.8;  // 20% below entry
            maxPrice = strike * 1.2;  // 20% above strike
        } else {
            minPrice = strike * 0.7;
            maxPrice = strike * 1.5;
        }

        const step = (maxPrice - minPrice) / 40;
        const data = [];

        for (let price = minPrice; price <= maxPrice; price += step) {
            let pl;
            if (strategy === STRATEGY_TYPES.COVERED_CALL) {
                // Maximum profit is limited to strike - entry + premium
                const maxProfit = ((strike - entry) / entry * 100) + (prem / entry * 100);

                if (price >= strike) {
                    pl = maxProfit;
                } else {
                    // P/L as percentage of entry price
                    pl = ((price - entry) / entry * 100) + (prem / entry * 100);
                }
            } else {
                // Long Call P/L
                const premiumPct = (prem * 100) / entry;  // Premium as percentage of entry
                if (price > strike) {
                    pl = ((price - strike) / entry * 100) - premiumPct;
                } else {
                    pl = -premiumPct;
                }
            }

            data.push({
                price: price.toFixed(2),
                pl: pl
            });
        }
        return data;
    }, [currentPrice, strikePrice, premium, strategy]);

    return (
        <div className="w-full h-[300px] bg-white">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={generateChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis
                        dataKey="price"
                        label={{ value: 'Stock Price', position: 'bottom', offset: -10 }}
                    />
                    <YAxis
                        label={{
                            value: 'Profit/Loss %',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 0
                        }}
                        domain={[-50, 50]}  // Fixed domain for all strategies
                        ticks={[-50, -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}  // 5% steps
                    />
                    <ReferenceLine
                        y={0}
                        stroke="#666"
                        strokeWidth={1}
                    />
                    <ReferenceLine
                        x={strikePrice}
                        stroke="#666"
                        strokeDasharray="3 3"
                        label={{
                            value: 'A',
                            position: 'top',
                            fill: '#666'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="pl"
                        stroke="#8884d8"
                        dot={false}
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProfitLossChart;