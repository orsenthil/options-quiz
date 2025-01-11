// src/strategies/callSpread/questions.js
import { shuffleArray } from "@/utils/questions.js";

const generateQuestionBase = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    // Convert string values to numbers and calculate key metrics
    const currentPrice = parseFloat(stockPrice);
    const longStrike = parseFloat(strikePrice) * 0.95;  // Strike A (slightly ITM)
    const shortStrike = parseFloat(strikePrice) * 1.05; // Strike B (slightly OTM)
    const longPremium = parseFloat(premium) * 1.2;      // Higher premium for lower strike
    const shortPremium = parseFloat(premium) * 0.8;     // Lower premium for higher strike
    const future = parseFloat(futurePrice);

    // Calculate key strategy metrics
    const netDebit = longPremium - shortPremium;
    const maxProfit = (shortStrike - longStrike) - netDebit;
    const breakEven = longStrike + netDebit;

    return [
        {
            id: 1,
            question: `You set up a call spread on ${symbol} by buying a call at strike $${longStrike.toFixed(2)} for $${longPremium.toFixed(2)} and selling a call at strike $${shortStrike.toFixed(2)} for $${shortPremium.toFixed(2)}. What's your net debit?`,
            options: [
                {
                    text: `$${netDebit.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(longPremium + shortPremium).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${shortPremium.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(shortStrike - longStrike).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `The net debit is the long call premium paid ($${longPremium.toFixed(2)}) minus the short call premium received ($${shortPremium.toFixed(2)}) = $${netDebit.toFixed(2)}`
        },
        {
            id: 2,
            question: `What's your maximum potential profit on this ${symbol} call spread?`,
            options: [
                {
                    text: `$${maxProfit.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(shortStrike - longStrike).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Unlimited profit`,
                    isCorrect: false
                },
                {
                    text: `$${(shortStrike - currentPrice).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Maximum profit is the difference between strikes ($${shortStrike.toFixed(2)} - $${longStrike.toFixed(2)} = $${(shortStrike - longStrike).toFixed(2)}) minus the net debit ($${netDebit.toFixed(2)}) = $${maxProfit.toFixed(2)}`
        },
        {
            id: 3,
            question: `What's your maximum potential loss on this ${symbol} call spread?`,
            options: [
                {
                    text: `$${netDebit.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${longPremium.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(shortStrike - longStrike).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Unlimited loss`,
                    isCorrect: false
                }
            ],
            explanation: `The maximum loss is limited to the net debit paid ($${netDebit.toFixed(2)}), which occurs if ${symbol} stays below the lower strike price of $${longStrike.toFixed(2)}`
        },
        {
            id: 4,
            question: `What's your break-even point at expiration for this ${symbol} call spread?`,
            options: [
                {
                    text: `$${breakEven.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${longStrike.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${shortStrike.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${currentPrice.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Break-even = Lower strike ($${longStrike.toFixed(2)}) + Net debit ($${netDebit.toFixed(2)}) = $${breakEven.toFixed(2)}`
        },
        {
            id: 5,
            question: `At expiration, ${symbol} is at $${future.toFixed(2)}. What is your profit/loss?`,
            options: [
                {
                    text: `$${(future >= shortStrike
                        ? maxProfit
                        : future <= longStrike
                            ? -netDebit
                            : (future - longStrike) - netDebit).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(future - currentPrice).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(future - breakEven).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(shortStrike - longStrike).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: future >= shortStrike
                ? `Stock is above upper strike ($${shortStrike.toFixed(2)}), resulting in maximum profit of $${maxProfit.toFixed(2)}`
                : future <= longStrike
                    ? `Stock is below lower strike ($${longStrike.toFixed(2)}), resulting in maximum loss of $${netDebit.toFixed(2)}`
                    : `Stock is between strikes, profit = Stock price - Lower strike - Net debit = $${(future - longStrike - netDebit).toFixed(2)}`
        },
        {
            id: 6,
            question: `How does implied volatility affect your ${symbol} call spread when the stock is near the upper strike of $${shortStrike.toFixed(2)}?`,
            options: [
                {
                    text: "A decrease in implied volatility is beneficial",
                    isCorrect: true
                },
                {
                    text: "An increase in implied volatility is beneficial",
                    isCorrect: false
                },
                {
                    text: "Implied volatility has no effect",
                    isCorrect: false
                },
                {
                    text: "The effect depends on time to expiration",
                    isCorrect: false
                }
            ],
            explanation: `When the stock is near the upper strike, a decrease in implied volatility helps because it decreases the value of the near-the-money option you sold faster than the in-the-money option you bought`
        },
        {
            id: 7,
            question: `If ${symbol} rises to $${(shortStrike * 1.2).toFixed(2)}, well above your upper strike, what's your regret cost compared to just buying a call?`,
            options: [
                {
                    text: `$${((shortStrike * 1.2 - shortStrike) * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: "No regret cost, maximum profit achieved",
                    isCorrect: false
                },
                {
                    text: `$${maxProfit.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${netDebit.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `You missed out on $${((shortStrike * 1.2 - shortStrike) * 100).toFixed(2)} of potential profit above your short strike, but remember you accepted this limited profit in exchange for reduced risk`
        },
        {
            id: 8,
            question: `What happens to your ${symbol} position if the stock price stays flat at $${currentPrice.toFixed(2)} as time decay increases?`,
            options: [
                {
                    text: "Both options lose value, net effect is minimal",
                    isCorrect: true
                },
                {
                    text: "Position becomes more valuable",
                    isCorrect: false
                },
                {
                    text: "You lose the entire net debit immediately",
                    isCorrect: false
                },
                {
                    text: "Only the short call loses value",
                    isCorrect: false
                }
            ],
            explanation: `Time decay affects both options, the one you bought and the one you sold, making the net effect relatively neutral when the stock price doesn't move significantly`
        },
        {
            id: 9,
            question: `What's the ideal price target for your ${symbol} call spread at expiration?`,
            options: [
                {
                    text: `$${shortStrike.toFixed(2)} or slightly higher`,
                    isCorrect: true
                },
                {
                    text: `$${longStrike.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${breakEven.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(shortStrike * 1.2).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `The ideal target is the upper strike ($${shortStrike.toFixed(2)}) or slightly above, as this gives you the maximum profit of $${maxProfit.toFixed(2)}`
        },
        {
            id: 10,
            question: `For your ${symbol} call spread, how much capital is at risk compared to buying 100 shares?`,
            options: [
                {
                    text: `$${netDebit.toFixed(2)} vs $${(currentPrice * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${longPremium.toFixed(2)} vs $${(currentPrice * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(shortStrike - longStrike).toFixed(2)} vs $${(currentPrice * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: "Same risk for both strategies",
                    isCorrect: false
                }
            ],
            explanation: `The call spread risks only the net debit ($${netDebit.toFixed(2)}), while buying 100 shares would risk $${(currentPrice * 100).toFixed(2)}, showing the spread's capital efficiency`
        }
    ];
};

export const generateLongCallSpreadQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    console.log('Generating Call Spread questions with:', {
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