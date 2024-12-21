// src/strategies/coveredCall/questions.js

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
            question: `For a covered call on ${symbol}, you own 100 shares at $${currentPrice} and sell a $${strike} call for $${prem} premium. What's your maximum profit if the stock is called away?`,
            options: [
                {
                    text: `$${((strike - currentPrice) * 100 + (prem* 100)).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(prem* 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((strike - currentPrice) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(strike * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Maximum profit = (Strike Price - Purchase Price) × 100 + Premium = ($${strike} - $${currentPrice}) × 100 + $${(prem* 100).toFixed(2)} = $${((strike - currentPrice) * 100 + (prem * 100)).toFixed(2)}`
        },
        {
            id: 2,
            question: `If ${symbol} drops to $${(currentPrice * 0.8).toFixed(2)} at expiration, what's your effective cost basis after collecting the premium?`,
            options: [
                {
                    text: `$${(currentPrice - prem).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${currentPrice}`,
                    isCorrect: false
                },
                {
                    text: `$${(currentPrice + prem).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${strike}`,
                    isCorrect: false
                }
            ],
            explanation: `The premium received ($${prem}) reduces your cost basis from $${currentPrice} to $${(currentPrice - prem).toFixed(2)} per share, providing some downside protection.`
        },
        {
            id: 3,
            question: `If ${symbol} rises to $${future.toFixed(2)} by ${expirationDate}, what happens to your covered call position?`,
            options: [
                {
                    text: `Your shares will be called away at $${strike.toFixed(2)}, and you'll keep the $${(prem * 100).toFixed(2)} premium`,
                    isCorrect: future > strike
                },
                {
                    text: `The option expires worthless, and you keep your shares and the $${(prem * 100).toFixed(2)} premium`,
                    isCorrect: future <= strike
                },
                {
                    text: `You must buy back the option at a loss`,
                    isCorrect: false
                },
                {
                    text: `You can exercise your option`,
                    isCorrect: false
                }
            ],
            explanation: future > strike
                ? `Since the stock price ($${future.toFixed(2)}) is above the strike price ($${strike.toFixed(2)}), your shares will be called away, but you keep the premium.`
                : `Since the stock price ($${future.toFixed(2)}) is below the strike price ($${strike.toFixed(2)}), the option expires worthless and you keep both shares and premium.`
        },
        {
            id: 4,
            question: `On ${selectedDate}, what's your break-even price point for this covered call position in ${symbol}?`,
            options: [
                {
                    text: `$${(currentPrice - prem).toFixed(2)}`,
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
            explanation: `Break-even = Stock Purchase Price - Premium Received = $${currentPrice.toFixed(2)} - $${prem.toFixed(2)} = $${(currentPrice - prem).toFixed(2)}`
        },
        {
            id: 5,
            question: `What's your maximum potential loss on this ${symbol} covered call position?`,
            options: [
                {
                    text: `$${((currentPrice - prem) * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(prem * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(currentPrice * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Unlimited loss`,
                    isCorrect: false
                }
            ],
            explanation: `Maximum loss occurs if stock goes to zero: (Stock price - Premium) × 100 = ($${currentPrice.toFixed(2)} - $${prem.toFixed(2)}) × 100 = $${((currentPrice - prem) * 100).toFixed(2)}. The premium received reduces your potential loss.`
        }
    ];
};

/// export const generateLongCallQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {

// This is the exported function that will be called once when generating questions
export const generateCoveredCallQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
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