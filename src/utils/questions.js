// Utility function to shuffle array
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const generateQuestionBase = (stockPrice, strikePrice, premium, symbol) => {
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
                {
                    text: `$${((priceUpTen - strike) * 100 - maxLoss).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${maxLoss.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(priceUpTen - currentPrice).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((priceUpTen - breakEven) * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `At $${priceUpTen.toFixed(2)}, you're above the strike price of $${strike}. Your profit would be: (Current Price - Strike Price) × 100 shares - Premium Paid`
        },
        {
            id: 2,
            question: `If ${symbol} drops to $${priceDownTen.toFixed(2)} (10% decrease), what is your maximum loss?`,
            options: [
                {
                    text: `$${((currentPrice - priceDownTen) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${maxLoss.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(strike - priceDownTen).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: 'Unlimited loss',
                    isCorrect: false
                }
            ],
            explanation: `Your maximum loss is always limited to the premium paid ($${maxLoss.toFixed(2)}), regardless of how low the stock price goes`
        },
        {
            id: 3,
            question: `For your ${symbol} call option, which price represents the break-even point?`,
            options: [
                {
                    text: `$${currentPrice.toFixed(2)} (Current Price)`,
                    isCorrect: false
                },
                {
                    text: `$${strike.toFixed(2)} (Strike Price)`,
                    isCorrect: false
                },
                {
                    text: `$${breakEven.toFixed(2)} (Strike + Premium)`,
                    isCorrect: true
                },
                {
                    text: `$${(strike - prem).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Break-even = Strike Price ($${strike}) + Premium ($${prem}) = $${breakEven.toFixed(2)}`
        },
        {
            id: 4,
            question: `With ${symbol} at $${currentPrice.toFixed(2)}, the strike price at $${strike.toFixed(2)}, is this call option currently in-the-money (ITM)?`,
            options: [
                {
                    text: `Yes, because the current price is above the break-even ($${breakEven.toFixed(2)})`,
                    isCorrect: false
                },
                {
                    text: `Yes, because the current price ($${currentPrice.toFixed(2)}) is above the strike price ($${strike.toFixed(2)})`,
                    isCorrect: currentPrice > strike
                },
                {
                    text: `No, because the current price ($${currentPrice.toFixed(2)}) is below the strike price ($${strike.toFixed(2)})`,
                    isCorrect: currentPrice <= strike
                },
                {
                    text: `No, because we haven't reached expiration yet`,
                    isCorrect: false
                }
            ],
            explanation: currentPrice > strike
                ? `The option is ITM because the current price ($${currentPrice.toFixed(2)}) is above the strike price ($${strike.toFixed(2)})`
                : `The option is OTM because the current price ($${currentPrice.toFixed(2)}) is below the strike price ($${strike.toFixed(2)})`
        },
        {
            id: 5,
            question: `If ${symbol} stays at exactly $${strike.toFixed(2)} (the strike price) at expiration, what is your loss?`,
            options: [
                {
                    text: 'No loss (break-even)',
                    isCorrect: false
                },
                {
                    text: `$${(maxLoss/2).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${maxLoss.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(strike * 0.1).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `At exactly the strike price, the option expires worthless. You lose the entire premium paid ($${maxLoss.toFixed(2)})`
        }
    ];
};

// This is the exported function that will be called once when generating questions
export const generateDynamicQuestions = (stockPrice, strikePrice, premium, symbol) => {
    const questions = generateQuestionBase(stockPrice, strikePrice, premium, symbol);

    // Shuffle and prepare the questions once
    return questions.map(q => {
        const shuffledOptions = shuffleArray(q.options);
        const correctAnswerIndex = shuffledOptions.findIndex(option => option.isCorrect);

        return {
            id: q.id,
            question: q.question,
            options: shuffledOptions.map(option => option.text),
            correctAnswer: correctAnswerIndex,
            explanation: q.explanation
        };
    });
};