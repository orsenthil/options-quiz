// Utility function to shuffle array
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const generateQuestionBase = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    // Convert string values to numbers and calculate key metrics
    const currentPrice = parseFloat(stockPrice);
    const strike = parseFloat(strikePrice);
    const prem = parseFloat(premium);
    const future = parseFloat(futurePrice);
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
        },
        // Additional backtesting questions - Add to generateQuestionBase
        {
            id: 6,
            question: `On ${expirationDate}, ${symbol} closed at $${futurePrice}. What was your actual profit/loss on this trade?`,
            options: [
                {
                    text: `$${((parseFloat(futurePrice) - strike) * 100 - maxLoss).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${((parseFloat(futurePrice) - currentPrice) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${maxLoss.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((parseFloat(futurePrice) - breakEven) * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `The stock closed at $${futurePrice}. Your profit/loss was: (Final Price - Strike Price) × 100 shares - Premium Paid = $${((parseFloat(futurePrice) - strike) * 100 - maxLoss).toFixed(2)}`
        },
        {
            id: 7,
            question: `Between ${selectedDate} and ${expirationDate}, ${symbol} moved from $${currentPrice} to $${futurePrice}. Was exercising this option profitable?`,
            options: [
                {
                    text: `Yes, the profit was $${((parseFloat(futurePrice) - strike) * 100 - maxLoss).toFixed(2)}`,
                    isCorrect: parseFloat(futurePrice) > breakEven
                },
                {
                    text: "No, letting the option expire was better",
                    isCorrect: parseFloat(futurePrice) <= breakEven
                },
                {
                    text: `Yes, but only if sold before expiration`,
                    isCorrect: false
                },
                {
                    text: `No, a loss of $${maxLoss.toFixed(2)} was inevitable`,
                    isCorrect: false
                }
            ],
            explanation: parseFloat(futurePrice) > breakEven
                ? `The stock price ($${futurePrice}) was above your breakeven ($${breakEven}), making exercise profitable.`
                : `The stock price ($${futurePrice}) was below your breakeven ($${breakEven}), resulting in a loss if exercised.`
        },
        {
            id: 8,
            question: `Given that ${symbol} moved from $${currentPrice} to $${futurePrice}, would buying 100 shares directly have been more profitable than this call option?`,
            options: [
                {
                    text: `Yes, stock profit would be $${((parseFloat(futurePrice) - currentPrice) * 100).toFixed(2)}`,
                    isCorrect: (parseFloat(futurePrice) - currentPrice) * 100 > (parseFloat(futurePrice) - strike) * 100 - maxLoss
                },
                {
                    text: `No, option profit of $${((parseFloat(futurePrice) - strike) * 100 - maxLoss).toFixed(2)} was better`,
                    isCorrect: (parseFloat(futurePrice) - currentPrice) * 100 <= (parseFloat(futurePrice) - strike) * 100 - maxLoss
                },
                {
                    text: "Both strategies would have the same profit",
                    isCorrect: false
                },
                {
                    text: "Cannot be determined without more information",
                    isCorrect: false
                }
            ],
            explanation: `Stock profit: $${((parseFloat(futurePrice) - currentPrice) * 100).toFixed(2)}
    Option profit: $${((parseFloat(futurePrice) - strike) * 100 - maxLoss).toFixed(2)}`
        },
        {
            id: 9,
            question: `Based on ${symbol}'s price movement from $${currentPrice} to $${futurePrice}, what was the return on investment (ROI) for this option trade?`,
            options: [
                {
                    text: `${(((parseFloat(futurePrice) - strike) * 100 - maxLoss) / maxLoss * 100).toFixed(2)}%`,
                    isCorrect: true
                },
                {
                    text: `${((parseFloat(futurePrice) - currentPrice) / currentPrice * 100).toFixed(2)}%`,
                    isCorrect: false
                },
                {
                    text: `${((parseFloat(futurePrice) - strike) / strike * 100).toFixed(2)}%`,
                    isCorrect: false
                },
                {
                    text: "0%",
                    isCorrect: false
                }
            ],
            explanation: `ROI = (Profit or Loss / Initial Investment) × 100. Your initial investment was the premium ($${maxLoss.toFixed(2)}).`
        },
        {
            id: 10,
            question: `Given that ${symbol} reached $${futurePrice} by ${expirationDate}, what lesson can be learned about the trade entry at $${currentPrice}?`,
            options: [
                {
                    text: `The strike price of $${strike} was well chosen as the stock moved above it`,
                    isCorrect: parseFloat(futurePrice) > strike && parseFloat(futurePrice) > breakEven
                },
                {
                    text: `A lower strike price would have been better given the final price`,
                    isCorrect: parseFloat(futurePrice) > currentPrice && parseFloat(futurePrice) <= breakEven
                },
                {
                    text: `Buying shares would have been better than options`,
                    isCorrect: parseFloat(futurePrice) <= currentPrice
                },
                {
                    text: `The entry price was irrelevant to the outcome`,
                    isCorrect: false
                }
            ],
            explanation: parseFloat(futurePrice) > breakEven
                ? `The trade was profitable as the stock moved above your breakeven price of $${breakEven}`
                : `The trade resulted in a loss as the stock stayed below your breakeven price of $${breakEven}`
        }
    ];
};

// This is the exported function that will be called once when generating questions
export const generateDynamicQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    const questions = generateQuestionBase(stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate);

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