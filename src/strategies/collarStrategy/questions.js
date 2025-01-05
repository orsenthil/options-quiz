// src/strategies/collarStrategy/questions.js
import { shuffleArray } from "@/utils/questions.js";

const generateQuestionBase = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    // Convert string values to numbers and calculate key metrics
    const currentPrice = parseFloat(stockPrice);
    const callStrike = parseFloat(strikePrice);  // This will be our call strike (B)
    const putStrike = currentPrice * 0.9;        // Put strike (A) at 90% of current price
    const callPremium = parseFloat(premium);
    const putPremium = parseFloat(premium) * 0.8; // Put premium typically costs more
    const future = parseFloat(futurePrice);

    // Calculate net debit/credit
    const netDebit = putPremium - callPremium;
    const maxProfit = (callStrike - currentPrice) - netDebit;
    const maxLoss = (currentPrice - putStrike) + netDebit;

    return [
        {
            id: 1,
            question: `You establish a collar on ${symbol} at $${currentPrice.toFixed(2)} by buying a put at $${putStrike.toFixed(2)} and selling a call at $${callStrike.toFixed(2)}. What's your maximum possible profit?`,
            options: [
                {
                    text: `$${maxProfit.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(callStrike - currentPrice).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Unlimited profit`,
                    isCorrect: false
                },
                {
                    text: `$${(putStrike - currentPrice).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `The maximum profit is limited to the call strike ($${callStrike.toFixed(2)}) minus current stock price ($${currentPrice.toFixed(2)}) minus the net debit ($${netDebit.toFixed(2)}) = $${maxProfit.toFixed(2)}`
        },
        {
            id: 2,
            question: `For your ${symbol} collar, what is your maximum potential loss?`,
            options: [
                {
                    text: `$${maxLoss.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `Unlimited loss`,
                    isCorrect: false
                },
                {
                    text: `$${(currentPrice - putStrike).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${putPremium.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `The maximum loss is limited to the current stock price ($${currentPrice.toFixed(2)}) minus put strike ($${putStrike.toFixed(2)}) plus the net debit ($${netDebit.toFixed(2)}) = $${maxLoss.toFixed(2)}`
        },
        {
            id: 3,
            question: `On ${symbol}, you paid $${putPremium.toFixed(2)} for the put and received $${callPremium.toFixed(2)} for the call. What was the net cost of establishing this collar?`,
            options: [
                {
                    text: `Net debit of $${netDebit.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `Net credit of $${(callPremium - putPremium).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(putPremium + callPremium).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$0 (Zero-cost collar)`,
                    isCorrect: false
                }
            ],
            explanation: `The net cost is the put premium paid ($${putPremium.toFixed(2)}) minus the call premium received ($${callPremium.toFixed(2)}) = Net debit of $${netDebit.toFixed(2)}`
        },
        {
            id: 4,
            question: `At expiration, ${symbol} is at $${future.toFixed(2)}. What happened to your position?`,
            options: [
                {
                    text: future > callStrike
                        ? `Stock was called away at $${callStrike.toFixed(2)}`
                        : future < putStrike
                            ? `Put protection kicked in at $${putStrike.toFixed(2)}`
                            : `Stock was retained, both options expired worthless`,
                    isCorrect: true
                },
                {
                    text: `You must sell the stock at market price`,
                    isCorrect: false
                },
                {
                    text: `You must buy more stock`,
                    isCorrect: false
                },
                {
                    text: `You lost both the stock and the premium`,
                    isCorrect: false
                }
            ],
            explanation: future > callStrike
                ? `Since the stock price ($${future.toFixed(2)}) exceeded the call strike ($${callStrike.toFixed(2)}), your stock was called away at the strike price`
                : future < putStrike
                    ? `Since the stock price ($${future.toFixed(2)}) fell below the put strike ($${putStrike.toFixed(2)}), your put protection limited your losses`
                    : `The stock price ($${future.toFixed(2)}) stayed between your put strike ($${putStrike.toFixed(2)}) and call strike ($${callStrike.toFixed(2)}), so both options expired worthless`
        },
        {
            id: 5,
            question: `What is your profit/loss on ${symbol} at the current price of $${future.toFixed(2)}?`,
            options: [
                {
                    text: `$${(future > callStrike
                        ? maxProfit
                        : future < putStrike
                            ? -(maxLoss)
                            : future - currentPrice - netDebit).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(future - currentPrice).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(putStrike - currentPrice).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${netDebit.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: future > callStrike
                ? `Stock was called away, resulting in maximum profit of $${maxProfit.toFixed(2)}`
                : future < putStrike
                    ? `Put protection limited your loss to $${maxLoss.toFixed(2)}`
                    : `Stock price movement ($${(future - currentPrice).toFixed(2)}) minus net debit ($${netDebit.toFixed(2)}) = $${(future - currentPrice - netDebit).toFixed(2)}`
        },
        {
            id: 6,
            question: `If ${symbol} drops by 15% to $${(currentPrice * 0.85).toFixed(2)}, how does your collar compare to just owning the stock?`,
            options: [
                {
                    text: `Collar limits loss to $${maxLoss.toFixed(2)} vs stock loss of $${(currentPrice * 0.15).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `Both strategies lose the same amount`,
                    isCorrect: false
                },
                {
                    text: `Collar loses more due to premium paid`,
                    isCorrect: false
                },
                {
                    text: `Cannot be determined`,
                    isCorrect: false
                }
            ],
            explanation: `With just stock ownership, a 15% drop means a loss of $${(currentPrice * 0.15).toFixed(2)}. The collar's put strike at $${putStrike.toFixed(2)} limits your loss to $${maxLoss.toFixed(2)}`
        }
    ];
};

export const generateCollarStrategyQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    console.log('Generating Collar Strategy questions with:', {
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
