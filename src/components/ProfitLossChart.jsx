import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const ProfitLossChart = ({ strikePrice, premium, currentPrice }) => {
    const generateChartData = () => {
        const data = [];
        const minPrice = Math.floor(currentPrice * 0.8);
        const maxPrice = Math.ceil(currentPrice * 1.2);

        for (let price = minPrice; price <= maxPrice; price += 2) {
            const pl = price > strikePrice
                ? ((price - strikePrice) * 100) - (premium * 100)
                : -premium * 100;

            data.push({
                price,
                pl
            });
        }
        return data;
    };

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateChartData()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="pl" stroke="#2563eb" strokeWidth={2} />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis
                        dataKey="price"
                        label={{ value: "Stock Price ($)", position: "bottom" }}
                    />
                    <YAxis
                        label={{ value: "Profit/Loss ($)", angle: -90, position: "left" }}
                    />
                    <Tooltip
                        formatter={(value) => [`P/L: $${value.toFixed(2)}`, ""]}
                        labelFormatter={(label) => `Stock Price: $${label}`}
                    />
                    <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                    <ReferenceLine x={strikePrice} stroke="#666" strokeDasharray="3 3" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProfitLossChart;