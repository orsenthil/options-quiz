export const generateDynamicQuestions = (stockPrice, strikePrice, premium, symbol) => {
    // Convert string values to numbers and calculate key metrics
    const currentPrice = parseFloat(stockPrice);
    const strike = parseFloat(strikePrice);
    const prem = parseFloat(premium);
    const breakEven = strike + prem;
    const maxLoss = prem * 100;
    const priceUpTen = currentPrice * 1.10;
    const priceDownTen = currentPrice * 0.90;

    return [
        {
            id: 1,
            question: `If ${symbol} rises to $${priceUpTen.toFixed(2)} (10% increase) before expiration, what would be your profit?`,
            options: [
                `$${((priceUpTen - strike) * 100 - maxLoss).toFixed(2)}`,
                `$${maxLoss.toFixed(2)}`,
                `$${(priceUpTen - currentPrice).toFixed(2)}`,
                `$${((priceUpTen - breakEven) * 100).toFixed(2)}`
            ],
            correctAnswer: 0,
            explanation: `At $${priceUpTen.toFixed(2)}, you're above the strike price of $${strike}. Your profit would be: (Current Price - Strike Price) × 100 shares - Premium Paid`
        },
        {
            id: 2,
            question: `If ${symbol} drops to $${priceDownTen.toFixed(2)} (10% decrease), what is your maximum loss?`,
            options: [
                `$${((currentPrice - priceDownTen) * 100).toFixed(2)}`,
                `$${maxLoss.toFixed(2)}`,
                `$${(strike - priceDownTen).toFixed(2)}`,
                'Unlimited loss'
            ],
            correctAnswer: 1,
            explanation: `Your maximum loss is always limited to the premium paid ($${maxLoss.toFixed(2)}), regardless of how low the stock price goes`
        },
        {
            id: 3,
            question: `For your ${symbol} call option, which price represents the break-even point?`,
            options: [
                `$${currentPrice.toFixed(2)} (Current Price)`,
                `$${strike.toFixed(2)} (Strike Price)`,
                `$${breakEven.toFixed(2)} (Strike + Premium)`,
                `$${(strike - prem).toFixed(2)}`
            ],
            correctAnswer: 2,
            explanation: `Break-even = Strike Price ($${strike}) + Premium ($${prem}) = $${breakEven.toFixed(2)}`
        },
        {
            id: 4,
            question: `With ${symbol} at $${currentPrice.toFixed(2)}, the strike price at $${strike.toFixed(2)}, is this call option currently in-the-money (ITM)?`,
            options: [
                `Yes, because the current price is above the break-even ($${breakEven.toFixed(2)})`,
                `Yes, because the current price ($${currentPrice.toFixed(2)}) is above the strike price ($${strike.toFixed(2)})`,
                `No, because the current price ($${currentPrice.toFixed(2)}) is below the strike price ($${strike.toFixed(2)})`,
                `No, because we haven't reached expiration yet`
            ],
            correctAnswer: currentPrice > strike ? 1 : 2,
            explanation: currentPrice > strike
                ? `The option is ITM because the current price ($${currentPrice.toFixed(2)}) is above the strike price ($${strike.toFixed(2)})`
                : `The option is OTM because the current price ($${currentPrice.toFixed(2)}) is below the strike price ($${strike.toFixed(2)})`
        },
        {
            id: 5,
            question: `If ${symbol} stays at exactly $${strike.toFixed(2)} (the strike price) at expiration, what is your loss?`,
            options: [
                'No loss (break-even)',
                `$${(maxLoss/2).toFixed(2)}`,
                `$${maxLoss.toFixed(2)}`,
                `$${(strike * 0.1).toFixed(2)}`
            ],
            correctAnswer: 2,
            explanation: `At exactly the strike price, the option expires worthless. You lose the entire premium paid ($${maxLoss.toFixed(2)})`
        }
    ];
};