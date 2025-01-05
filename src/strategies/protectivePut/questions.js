import { shuffleArray } from "@/utils/questions.js";

const generateQuestionBase = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    // Convert string values to numbers and calculate key metrics
    const currentPrice = parseFloat(stockPrice);
    const strike = parseFloat(strikePrice);
    const prem = parseFloat(premium);
    const future = parseFloat(futurePrice);
    const totalCost = currentPrice + prem;
    const maxLoss = (currentPrice - strike + prem) * 100; // Maximum loss is limited
    const priceDownTwenty = currentPrice * 0.80;
    const priceUpTen = currentPrice * 1.10;

    return [
        {
            id: 1,
            question: `You own 100 shares of ${symbol} at $${currentPrice.toFixed(2)} and buy a protective put at strike $${strike.toFixed(2)} for $${prem.toFixed(2)}. What's your maximum possible loss per share?`,
            options: [
                {
                    text: `$${(currentPrice - strike + prem).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${currentPrice.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${prem.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${strike.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Your maximum loss is limited to the difference between your stock purchase price ($${currentPrice.toFixed(2)}) and the put strike price ($${strike.toFixed(2)}), plus the premium paid ($${prem.toFixed(2)}). This equals $${(currentPrice - strike + prem).toFixed(2)} per share.`
        },
        {
            id: 2,
            question: `If ${symbol} crashes to $${priceDownTwenty.toFixed(2)} (20% drop), how much protection does your protective put provide?`,
            options: [
                {
                    text: `$${((strike - priceDownTwenty) * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${((currentPrice - priceDownTwenty) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(prem * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$0.00`,
                    isCorrect: false
                }
            ],
            explanation: `The protective put allows you to sell at $${strike.toFixed(2)} even though the market price is $${priceDownTwenty.toFixed(2)}. This provides protection of $${((strike - priceDownTwenty) * 100).toFixed(2)} for your 100 shares, offsetting much of the stock's decline.`
        },
        {
            id: 3,
            question: `If ${symbol} rises to $${priceUpTen.toFixed(2)} (10% increase), what's your net profit considering the cost of protection?`,
            options: [
                {
                    text: `$${((priceUpTen - currentPrice) * 100 - prem * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${((priceUpTen - currentPrice) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((priceUpTen - strike) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(prem * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Your profit is the stock's gain ($${((priceUpTen - currentPrice) * 100).toFixed(2)}) minus the cost of the put protection ($${(prem * 100).toFixed(2)}), resulting in a net profit of $${((priceUpTen - currentPrice) * 100 - prem * 100).toFixed(2)}.`
        },
        {
            id: 4,
            question: `When would be the most cost-effective time to buy this protective put for ${symbol}?`,
            options: [
                {
                    text: `After the stock has had a significant rally and you want to protect gains`,
                    isCorrect: true
                },
                {
                    text: `When the stock is at its lowest point`,
                    isCorrect: false
                },
                {
                    text: `Right before earnings announcement`,
                    isCorrect: false
                },
                {
                    text: `When the stock is trending downward`,
                    isCorrect: false
                }
            ],
            explanation: `It's often most psychologically and financially optimal to buy protective puts after a stock has rallied. This way, you're using some of your paper profits to protect against a downturn, rather than spending additional capital when the stock is already down.`
        },
        {
            id: 5,
            question: `Comparing a protective put to a stop-loss order for ${symbol}, which statement is most accurate?`,
            options: [
                {
                    text: `A protective put provides guaranteed protection at a specific price but costs a premium`,
                    isCorrect: true
                },
                {
                    text: `A stop-loss order is always more effective in a crash`,
                    isCorrect: false
                },
                {
                    text: `A protective put and stop-loss provide identical protection`,
                    isCorrect: false
                },
                {
                    text: `A stop-loss is more expensive but more reliable`,
                    isCorrect: false
                }
            ],
            explanation: `While a stop-loss order is free, it might execute at a much lower price if the stock gaps down overnight. A protective put guarantees your exit price regardless of how quickly the stock falls, though you pay a premium for this insurance.`
        },
        {
            id: 6,
            question: `What happens to your protective put strategy on ${symbol} if implied volatility increases significantly?`,
            options: [
                {
                    text: `The put option becomes more valuable, offsetting some of its time decay`,
                    isCorrect: true
                },
                {
                    text: `The strategy becomes less effective`,
                    isCorrect: false
                },
                {
                    text: `There is no effect on the protective put`,
                    isCorrect: false
                },
                {
                    text: `The maximum loss increases`,
                    isCorrect: false
                }
            ],
            explanation: `An increase in implied volatility will increase the value of your put option. This is beneficial as it can help offset the negative effect of time decay and potentially allow you to sell the put for a profit if you no longer need the protection.`
        },
        {
            id: 7,
            question: `By ${expirationDate}, ${symbol} is at $${futurePrice}. What was the outcome of your protective put strategy?`,
            options: [
                {
                    text: future > currentPrice
                        ? `Profit of $${((future - currentPrice) * 100 - prem * 100).toFixed(2)}`
                        : future < strike
                            ? `Loss limited to $${maxLoss.toFixed(2)}`
                            : `Loss of $${((currentPrice - future) * 100 + prem * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `Loss of entire investment`,
                    isCorrect: false
                },
                {
                    text: `Profit equal to put premium`,
                    isCorrect: false
                },
                {
                    text: `Break-even regardless of stock price`,
                    isCorrect: false
                }
            ],
            explanation: future > currentPrice
                ? `The stock rose, giving you a profit of $${((future - currentPrice) * 100).toFixed(2)} minus the put cost of $${(prem * 100).toFixed(2)}.`
                : future < strike
                    ? `The stock fell below the put strike, but your loss was limited to $${maxLoss.toFixed(2)} thanks to the protective put.`
                    : `The stock fell but not below the put strike. Your loss is the stock decline plus the put premium.`
        },
        {
            id: 8,
            question: `In what market conditions would this protective put strategy on ${symbol} be most valuable?`,
            options: [
                {
                    text: `During high market uncertainty or ahead of major events`,
                    isCorrect: true
                },
                {
                    text: `In a steadily rising market`,
                    isCorrect: false
                },
                {
                    text: `During low volatility periods`,
                    isCorrect: false
                },
                {
                    text: `When the stock is trending downward`,
                    isCorrect: false
                }
            ],
            explanation: `Protective puts are most valuable during periods of high uncertainty or before major events (earnings, FDA decisions, etc.) where the stock could gap down significantly. They provide insurance against sudden, sharp declines that might bypass stop-loss orders.`
        },
        {
            id: 9,
            question: `What's the break-even point for your ${symbol} position including the protective put?`,
            options: [
                {
                    text: `$${(currentPrice + prem).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${currentPrice.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${strike.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(strike + prem).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Your break-even point is your stock purchase price ($${currentPrice.toFixed(2)}) plus the cost of the put protection ($${prem.toFixed(2)}), or $${(currentPrice + prem).toFixed(2)}. The stock needs to rise by at least the cost of the put for you to profit.`
        },
        {
            id: 10,
            question: `If you're worried about a potential market correction, which strike price selection would provide the best protection for ${symbol}?`,
            options: [
                {
                    text: `At-the-money strike near $${currentPrice.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `Deep out-of-the-money strike at $${(currentPrice * 0.7).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Deep in-the-money strike at $${(currentPrice * 1.3).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Multiple strikes at different prices`,
                    isCorrect: false
                }
            ],
            explanation: `An at-the-money protective put provides the best balance of cost and protection. While it's more expensive than an OTM put, it starts protecting your position immediately if the stock falls. ITM puts provide immediate protection but are unnecessarily expensive.`
        }
    ];
};

export const generateProtectivePutQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    console.log('Generating Protective Put questions with:', {
        stockPrice,
        strikePrice,
        premium,
        symbol,
        futurePrice,
        expirationDate,
        selectedDate
    });

    const questions = generateQuestionBase(stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate);

    // Shuffle and prepare the questions
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