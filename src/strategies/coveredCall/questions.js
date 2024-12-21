// src/strategies/coveredCall/questions.js

export const generateCoveredCallQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    const currentPrice = parseFloat(stockPrice);
    const strike = parseFloat(strikePrice);
    const prem = parseFloat(premium);
    const future = parseFloat(futurePrice);
    const maxProfit = ((strike - currentPrice) * 100) + (prem * 100);
    const maxLoss = (currentPrice * 100) - (prem * 100);

    return [
        {
            id: 1,
            question: `You buy 100 shares of ${symbol} at $${currentPrice} and sell a call at strike $${strike} for $${premium} premium. What's your maximum profit?`,
            options: [
                {
                    text: `$${maxProfit.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(prem * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((strike - currentPrice) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: 'Unlimited profit',
                    isCorrect: false
                }
            ],
            explanation: `Maximum profit = (Strike - Stock Price) × 100 + Premium = ($${strike} - $${currentPrice}) × 100 + $${(prem * 100).toFixed(2)} = $${maxProfit.toFixed(2)}`
        },
        // Add more covered call specific questions here
    ];
};