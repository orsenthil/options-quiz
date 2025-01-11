// src/strategies/longPutSpread/questions.js
import { shuffleArray } from "@/utils/questions.js";

const generateQuestionBase = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    // Convert string values to numbers and calculate key metrics
    const currentPrice = parseFloat(stockPrice);
    const strikeB = parseFloat(strikePrice);        // Higher strike price (buy put)
    const strikeA = strikeB * 0.95;                // Lower strike price (sell put), 5% below B
    const premiumB = parseFloat(premium);           // Premium paid for higher strike put
    const premiumA = premiumB * 0.7;               // Premium received for lower strike put
    const netDebit = premiumB - premiumA;          // Net debit paid
    const maxProfit = (strikeB - strikeA) - netDebit;  // Max profit potential
    const future = parseFloat(futurePrice);
    const breakEven = strikeB - netDebit;          // Break-even price

    return [
        {
            id: 1,
            question: `You establish a long put spread on ${symbol} with strike prices $${strikeB.toFixed(2)} (buy) and $${strikeA.toFixed(2)} (sell). What's your maximum possible profit?`,
            options: [
                {
                    text: `$${(maxProfit * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(strikeB - strikeA).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(premiumB * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Unlimited profit`,
                    isCorrect: false
                }
            ],
            explanation: `The maximum profit is the difference between strikes ($${strikeB.toFixed(2)} - $${strikeA.toFixed(2)} = $${(strikeB - strikeA).toFixed(2)}) minus the net debit paid ($${netDebit.toFixed(2)}) × 100 = $${(maxProfit * 100).toFixed(2)}`
        },
        {
            id: 2,
            question: `What is your maximum potential loss on this ${symbol} put spread?`,
            options: [
                {
                    text: `$${(netDebit * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(premiumB * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(strikeB - strikeA).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Unlimited loss`,
                    isCorrect: false
                }
            ],
            explanation: `The maximum loss is limited to the net debit paid: Premium paid for higher strike ($${premiumB.toFixed(2)}) minus premium received for lower strike ($${premiumA.toFixed(2)}) × 100 = $${(netDebit * 100).toFixed(2)}`
        },
        {
            id: 3,
            question: `What is the break-even price for your ${symbol} put spread at expiration?`,
            options: [
                {
                    text: `$${breakEven.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${strikeB.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${strikeA.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${currentPrice.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Break-even price = Higher strike price ($${strikeB.toFixed(2)}) minus net debit ($${netDebit.toFixed(2)}) = $${breakEven.toFixed(2)}`
        },
        {
            id: 4,
            question: `At expiration, ${symbol} is at $${future.toFixed(2)}. What is your profit/loss?`,
            options: [
                {
                    text: `$${(future <= strikeA
                        ? (maxProfit * 100)
                        : future >= strikeB
                            ? -(netDebit * 100)
                            : ((strikeB - future) - netDebit) * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${((strikeB - future) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((strikeA - future) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(netDebit * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: future <= strikeA
                ? `Stock is below both strikes, achieving maximum profit of $${(maxProfit * 100).toFixed(2)}`
                : future >= strikeB
                    ? `Stock is above both strikes, resulting in maximum loss of $${(netDebit * 100).toFixed(2)}`
                    : `Stock is between strikes, profit/loss = (Higher strike - Stock price - Net debit) × 100 = $${((strikeB - future - netDebit) * 100).toFixed(2)}`
        },
        {
            id: 5,
            question: `If ${symbol}'s implied volatility increases significantly, how should it affect your position if the stock is currently near $${(strikeB * 1.02).toFixed(2)}?`,
            options: [
                {
                    text: `Beneficial, as it increases the value of your long put more than the short put`,
                    isCorrect: true
                },
                {
                    text: `Harmful, as it increases the value of your short put more`,
                    isCorrect: false
                },
                {
                    text: `No effect, as the changes cancel each other out`,
                    isCorrect: false
                },
                {
                    text: `Harmful to both puts equally`,
                    isCorrect: false
                }
            ],
            explanation: `When the stock is above the higher strike, increased implied volatility helps because it increases the value of your out-of-the-money long put more than the further out-of-the-money short put.`
        },
        {
            id: 6,
            question: `What happens to your ${symbol} put spread if the stock drops to $${(strikeA * 0.95).toFixed(2)} before expiration?`,
            options: [
                {
                    text: `Achieves maximum profit of $${(maxProfit * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `Results in a loss of $${(netDebit * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Breaks even`,
                    isCorrect: false
                },
                {
                    text: `Profit continues to increase as stock falls further`,
                    isCorrect: false
                }
            ],
            explanation: `When the stock falls below the lower strike price ($${strikeA.toFixed(2)}), the spread reaches its maximum value of $${((strikeB - strikeA) * 100).toFixed(2)}, resulting in the maximum profit of $${(maxProfit * 100).toFixed(2)} after subtracting the net debit paid.`
        },
        {
            id: 7,
            question: `For your ${symbol} put spread, how does time decay (theta) affect the position when the stock is at $${(strikeB * 0.98).toFixed(2)}?`,
            options: [
                {
                    text: `Relatively neutral as it affects both puts`,
                    isCorrect: true
                },
                {
                    text: `Strongly negative as both puts lose value`,
                    isCorrect: false
                },
                {
                    text: `Strongly positive as short put decays faster`,
                    isCorrect: false
                },
                {
                    text: `Only affects the long put position`,
                    isCorrect: false
                }
            ],
            explanation: `Time decay has a relatively neutral effect on a put spread because it's eroding the value of both the long put you bought and the short put you sold, partially offsetting each other.`
        },
        {
            id: 8,
            question: `If ${symbol} is at $${(strikeA * 0.97).toFixed(2)} at expiration, what actions should you take?`,
            options: [
                {
                    text: `Exercise your long put and get assigned on your short put`,
                    isCorrect: true
                },
                {
                    text: `Only exercise your long put`,
                    isCorrect: false
                },
                {
                    text: `Let both puts expire`,
                    isCorrect: false
                },
                {
                    text: `Only get assigned on your short put`,
                    isCorrect: false
                }
            ],
            explanation: `With the stock below both strikes at expiration, both puts are in-the-money. You'll exercise your long put to sell at $${strikeB.toFixed(2)} and be assigned on your short put to buy at $${strikeA.toFixed(2)}, realizing the maximum profit.`
        },
        {
            id: 9,
            question: `Compared to buying just the $${strikeB.toFixed(2)} put on ${symbol}, what's the main advantage of this spread?`,
            options: [
                {
                    text: `Lower cost and defined risk`,
                    isCorrect: true
                },
                {
                    text: `Higher potential profit`,
                    isCorrect: false
                },
                {
                    text: `No obligation to buy stock`,
                    isCorrect: false
                },
                {
                    text: `Unlimited profit potential`,
                    isCorrect: false
                }
            ],
            explanation: `The spread reduces your cost from $${(premiumB * 100).toFixed(2)} to $${(netDebit * 100).toFixed(2)} by selling the lower strike put. While this limits your profit potential, it reduces your risk and cost basis.`
        },
        {
            id: 10,
            question: `What's the ideal market condition for your ${symbol} put spread position?`,
            options: [
                {
                    text: `Moderate downside move to $${strikeA.toFixed(2)} by expiration`,
                    isCorrect: true
                },
                {
                    text: `Sharp upward move above $${strikeB.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Stock staying at current price`,
                    isCorrect: false
                },
                {
                    text: `Extreme drop well below $${(strikeA * 0.8).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `The ideal scenario is a moderate decline to or below the lower strike price ($${strikeA.toFixed(2)}) by expiration, which would allow the spread to achieve its maximum value of $${((strikeB - strikeA) * 100).toFixed(2)}.`
        }
    ];
};

export const generateLongPutSpreadQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    console.log('Generating Long Put Spread questions with:', {
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