// src/strategies/longPut/questions.js

import { shuffleArray } from "@/utils/questions.js";

const generateQuestionBase = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    // Convert string values to numbers and calculate key metrics
    const currentPrice = parseFloat(stockPrice);
    const strike = parseFloat(strikePrice);
    const prem = parseFloat(premium);
    const future = parseFloat(futurePrice);
    const breakEven = strike - prem;
    const maxLoss = prem * 100;
    const priceUpTen = currentPrice * 1.10;
    const priceDownTen = currentPrice * 0.90;

    return [
        {
            id: 1,
            question: `If ${symbol} falls to $${priceDownTen.toFixed(2)} (10% decrease) before expiration, what would be your profit?`,
            options: [
                {
                    text: `$${((strike - priceDownTen) * 100 - maxLoss).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${maxLoss.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((strike - priceDownTen) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((currentPrice - priceDownTen) * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `At $${priceDownTen.toFixed(2)}, the profit is: (Strike Price - Stock Price) × 100 shares - Premium Paid = ($${strike.toFixed(2)} - $${priceDownTen.toFixed(2)}) × 100 - $${maxLoss.toFixed(2)} = $${((strike - priceDownTen) * 100 - maxLoss).toFixed(2)}`
        },
        {
            id: 2,
            question: `If ${symbol} rises to $${priceUpTen.toFixed(2)} (10% increase), what is your maximum loss?`,
            options: [
                {
                    text: `$${((priceUpTen - currentPrice) * 100).toFixed(2)}`,
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
                    text: `$${((priceUpTen - strike) * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `With a long put option, your maximum loss is limited to the premium paid ($${maxLoss.toFixed(2)}), no matter how high the stock price goes.`
        },
        {
            id: 3,
            question: `For your ${symbol} put option, what is the break-even stock price at expiration?`,
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
                    text: `$${breakEven.toFixed(2)} (Strike - Premium)`,
                    isCorrect: true
                },
                {
                    text: `$${(strike + prem).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Break-even price at expiration = Strike Price - Premium per share = $${strike.toFixed(2)} - $${prem.toFixed(2)} = $${breakEven.toFixed(2)}`
        },
        {
            id: 4,
            question: `How does time decay (theta) affect your long put position in ${symbol}?`,
            options: [
                {
                    text: `Time decay helps the position by increasing the put's value`,
                    isCorrect: false
                },
                {
                    text: `Time decay hurts the position by reducing the put's value`,
                    isCorrect: true
                },
                {
                    text: `Time decay has no effect on the position`,
                    isCorrect: false
                },
                {
                    text: `Time decay only affects in-the-money puts`,
                    isCorrect: false
                }
            ],
            explanation: `Time decay (theta) is your enemy when buying options. Each day that passes, your put option loses some time value, assuming all other factors remain constant.`
        },
        {
            id: 5,
            question: `On ${expirationDate}, ${symbol} closed at $${futurePrice}. What was your actual profit/loss on this trade?`,
            options: [
                {
                    text: `$${((future < strike ? (strike - future) * 100 : 0) - maxLoss).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${((currentPrice - future) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((strike - future) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${maxLoss.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: future < strike
                ? `The stock closed below the strike price, so your profit is: (Strike Price - Final Price) × 100 - Premium = ($${strike.toFixed(2)} - $${future.toFixed(2)}) × 100 - $${maxLoss.toFixed(2)} = $${((strike - future) * 100 - maxLoss).toFixed(2)}`
                : `The stock closed above the strike price, so the option expired worthless. Your loss is the premium paid: $${maxLoss.toFixed(2)}`
        },
        {
            id: 6,
            question: `What's the maximum profit potential for your ${symbol} long put position?`,
            options: [
                {
                    text: `$${maxLoss.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(strike * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((strike * 100) - maxLoss).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `Unlimited profit potential`,
                    isCorrect: false
                }
            ],
            explanation: `The maximum profit occurs if the stock goes to $0. At that point, you can sell shares at the strike price ($${strike.toFixed(2)}) that cost $0, for a profit of (Strike Price × 100) - Premium = $${((strike * 100) - maxLoss).toFixed(2)}`
        },
        {
            id: 7,
            question: `How would an increase in implied volatility affect your ${symbol} put option?`,
            options: [
                {
                    text: `It would increase the put's value`,
                    isCorrect: true
                },
                {
                    text: `It would decrease the put's value`,
                    isCorrect: false
                },
                {
                    text: `It would have no effect on the put's value`,
                    isCorrect: false
                },
                {
                    text: `It only affects call options`,
                    isCorrect: false
                }
            ],
            explanation: `Higher implied volatility increases option premiums for both calls and puts. As a put buyer, you benefit from increased volatility as it raises the value of your option.`
        },
        {
            id: 8,
            question: `If ${symbol} trades sideways and stays at $${currentPrice.toFixed(2)} until expiration, what happens to your put option?`,
            options: [
                {
                    text: `You break even`,
                    isCorrect: false
                },
                {
                    text: `You lose the entire premium of $${maxLoss.toFixed(2)}`,
                    isCorrect: currentPrice >= strike
                },
                {
                    text: `You make a partial profit`,
                    isCorrect: currentPrice < strike
                },
                {
                    text: `The option extends to the next expiration`,
                    isCorrect: false
                }
            ],
            explanation: currentPrice >= strike
                ? `If the stock stays at $${currentPrice.toFixed(2)}, which is above the strike price of $${strike.toFixed(2)}, your put expires worthless and you lose the entire premium paid ($${maxLoss.toFixed(2)})`
                : `If the stock stays at $${currentPrice.toFixed(2)}, which is below the strike price of $${strike.toFixed(2)}, you'll make a partial profit of $${((strike - currentPrice) * 100 - maxLoss).toFixed(2)}`
        },
        {
            id: 9,
            question: `How does your ${symbol} put compare to shorting 100 shares at $${currentPrice.toFixed(2)}?`,
            options: [
                {
                    text: `The put has limited risk while shorting has unlimited risk`,
                    isCorrect: true
                },
                {
                    text: `Shorting has limited risk while the put has unlimited risk`,
                    isCorrect: false
                },
                {
                    text: `Both strategies have the same risk profile`,
                    isCorrect: false
                },
                {
                    text: `Both strategies have unlimited risk`,
                    isCorrect: false
                }
            ],
            explanation: `A long put limits your risk to the premium paid ($${maxLoss.toFixed(2)}), while shorting stock exposes you to unlimited risk if the stock price rises.`
        },
        {
            id: 10,
            question: `What's the best scenario for your ${symbol} put option?`,
            options: [
                {
                    text: `Stock price rises significantly`,
                    isCorrect: false
                },
                {
                    text: `Stock price stays at current level`,
                    isCorrect: false
                },
                {
                    text: `Stock price falls significantly below break-even`,
                    isCorrect: true
                },
                {
                    text: `Stock price stays above strike price`,
                    isCorrect: false
                }
            ],
            explanation: `The best scenario is a significant drop in stock price below your break-even of $${breakEven.toFixed(2)}. This maximizes your profit potential while your risk remains limited to the premium paid.`
        }
    ];
};

export const generateLongPutQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    console.log('Generating Long Put questions with:', {
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