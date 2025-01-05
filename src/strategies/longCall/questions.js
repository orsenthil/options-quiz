// src/strategies/longCall/questions.js

import {shuffleArray} from "@/utils/questions.js";

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
                    text: `$${(maxLoss).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((priceUpTen - strike) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((priceUpTen - currentPrice) * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `At $${priceUpTen.toFixed(2)}, the profit is: (Stock Price - Strike Price) × 100 shares - Premium Paid = ($${priceUpTen.toFixed(2)} - $${strike.toFixed(2)}) × 100 - $${maxLoss.toFixed(2)} = $${((priceUpTen - strike) * 100 - maxLoss).toFixed(2)}`
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
                    text: `$${(currentPrice * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((strike - priceDownTen) * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `With a long call option, your maximum loss is limited to the premium paid ($${maxLoss.toFixed(2)}), no matter how low the stock price goes.`
        },
        {
            id: 3,
            question: `For your ${symbol} call option, what is the break-even stock price at expiration?`,
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
            explanation: `Break-even price at expiration = Strike Price + Premium per share = $${strike.toFixed(2)} + $${prem.toFixed(2)} = $${breakEven.toFixed(2)}`
        },
        {
            id: 4,
            question: `With ${symbol} currently at $${currentPrice.toFixed(2)}, what happens if the stock expires exactly at the strike price of $${strike.toFixed(2)}?`,
            options: [
                {
                    text: `You break even`,
                    isCorrect: false
                },
                {
                    text: `You lose $${maxLoss.toFixed(2)} (the premium paid)`,
                    isCorrect: true
                },
                {
                    text: `You lose $${(maxLoss/2).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `You make a small profit`,
                    isCorrect: false
                }
            ],
            explanation: `At expiration, if the stock price equals the strike price, the option expires at-the-money and worthless. You lose the entire premium paid ($${maxLoss.toFixed(2)}).`
        },
        {
            id: 5,
            question: `On ${expirationDate}, ${symbol} closed at $${futurePrice}. What was your actual profit/loss on this trade?`,
            options: [
                {
                    text: `$${((future > strike ? (future - strike) * 100 : 0) - maxLoss).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${((future - currentPrice) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((future - strike) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${maxLoss.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: future > strike
                ? `The stock closed above the strike price, so your profit is: (Final Price - Strike Price) × 100 - Premium = ($${future.toFixed(2)} - $${strike.toFixed(2)}) × 100 - $${maxLoss.toFixed(2)} = $${((future - strike) * 100 - maxLoss).toFixed(2)}`
                : `The stock closed below the strike price, so the option expired worthless. Your loss is the premium paid: $${maxLoss.toFixed(2)}`
        },
        {
            id: 6,
            question: `Between ${selectedDate} and ${expirationDate}, ${symbol} moved from $${currentPrice} to $${futurePrice}. What was your return on investment (ROI) for this call option trade?`,
            options: [
                {
                    text: `${(((future > strike ? (future - strike) * 100 : 0) - maxLoss) / maxLoss * 100).toFixed(2)}%`,
                    isCorrect: true
                },
                {
                    text: `${((future - currentPrice) / currentPrice * 100).toFixed(2)}%`,
                    isCorrect: false
                },
                {
                    text: `${((future - strike) / strike * 100).toFixed(2)}%`,
                    isCorrect: false
                },
                {
                    text: `${(-100).toFixed(2)}%`,
                    isCorrect: false
                }
            ],
            explanation: `Let's calculate the ROI step by step:

1. Initial Investment = Premium Paid = $${maxLoss.toFixed(2)}
2. Final Value = ${future > strike ? `($${future.toFixed(2)} - $${strike.toFixed(2)}) × 100 = $${((future - strike) * 100).toFixed(2)}` : '$0 (option expires worthless)'}
3. Total Profit/Loss = Final Value - Premium = ${future > strike ? `$${((future - strike) * 100).toFixed(2)} - $${maxLoss.toFixed(2)} = $${((future - strike) * 100 - maxLoss).toFixed(2)}` : `-$${maxLoss.toFixed(2)}`}
4. ROI = (Total Profit or Loss / Initial Investment) × 100
   = ($${((future > strike ? (future - strike) * 100 - maxLoss : -maxLoss)).toFixed(2)} / $${maxLoss.toFixed(2)}) × 100
   = ${(((future > strike ? (future - strike) * 100 : 0) - maxLoss) / maxLoss * 100).toFixed(2)}%

This ROI calculation is specific to options trading, where your initial investment is the premium paid, not the full stock price. ${future > strike ? 'Since the stock price exceeded the strike price, the option had intrinsic value at expiration.' : 'Since the stock price remained below the strike price, the option expired worthless.'} This demonstrates the leveraged nature of options, where your percentage gains and losses can be much larger than the corresponding stock price movement.`
        },
        {
            id: 7,
            question: `Comparing strategies for ${symbol}, which would have been more profitable: the call option or buying 100 shares directly?`,
            options: [
                {
                    text: `Buying shares with profit of $${((future - currentPrice) * 100).toFixed(2)}`,
                    isCorrect: (future - currentPrice) * 100 > (future > strike ? (future - strike) * 100 - maxLoss : -maxLoss)
                },
                {
                    text: `Call option with ${future > strike ? 'profit' : 'loss'} of $${((future > strike ? (future - strike) * 100 - maxLoss : -maxLoss)).toFixed(2)}`,
                    isCorrect: (future - currentPrice) * 100 <= (future > strike ? (future - strike) * 100 - maxLoss : -maxLoss)
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
            explanation: `Stock profit/loss: ($${future.toFixed(2)} - $${currentPrice.toFixed(2)}) × 100 = $${((future - currentPrice) * 100).toFixed(2)}
Option profit/loss: ${future > strike ? `($${future.toFixed(2)} - $${strike.toFixed(2)}) × 100 - $${maxLoss.toFixed(2)}` : `-$${maxLoss.toFixed(2)}`} = $${((future > strike ? (future - strike) * 100 - maxLoss : -maxLoss)).toFixed(2)}`
        },
        {
            id: 8,
            question: `Based on ${symbol}'s movement to $${futurePrice}, what was the key lesson from this trade?`,
            options: [
                {
                    text: `The strike selection of $${strike} was optimal as the option ${future > breakEven ? 'was profitable' : 'minimized losses'}`,
                    isCorrect: future > breakEven
                },
                {
                    text: `A lower strike price would have been better given the final price of $${futurePrice}`,
                    isCorrect: future > currentPrice && future <= breakEven
                },
                {
                    text: `Stock ownership would have outperformed the option`,
                    isCorrect: future <= currentPrice
                },
                {
                    text: `The outcome was purely random and no lesson can be drawn`,
                    isCorrect: false
                }
            ],
            explanation: future > breakEven
                ? `The trade was profitable as the stock moved above your break-even price of $${breakEven.toFixed(2)}, validating the strike selection.`
                : future > currentPrice
                    ? `While the stock rose, it didn't exceed the break-even price of $${breakEven.toFixed(2)}, suggesting a lower strike might have worked better.`
                    : `The stock price fell, making stock ownership or no position the better choice.`
        }
    ];
};

/// export const generateLongCallQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {

// This is the exported function that will be called once when generating questions
export const generateLongCallQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    console.log('Generating questions with:', {
        stockPrice,
        strikePrice,
        premium,
        symbol,
        futurePrice,
        expirationDate,
        selectedDate
    });

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