// src/strategies/figLeaf/questions.js
import { shuffleArray } from "@/utils/questions.js";

const generateQuestionBase = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    // Convert string values to numbers and calculate key metrics
    const currentPrice = parseFloat(stockPrice);
    const shortStrike = parseFloat(strikePrice);  // OTM short-term call strike (B)
    const leapsStrike = currentPrice * 0.8;       // ITM LEAPS call strike (A), 20% ITM
    const shortPremium = parseFloat(premium);      // Premium for short-term call
    const leapsPremium = shortPremium * 3;        // LEAPS premium (typically higher due to longer duration)
    const future = parseFloat(futurePrice);

    // Net debit calculation
    const netDebit = leapsPremium - shortPremium;

    return [
        {
            id: 1,
            question: `You implement a Fig Leaf on ${symbol} at $${currentPrice.toFixed(2)} by buying a LEAPS call at strike $${leapsStrike.toFixed(2)} for $${leapsPremium.toFixed(2)} and selling a 30-day call at strike $${shortStrike.toFixed(2)} for $${shortPremium.toFixed(2)}. What's your initial net investment?`,
            options: [
                {
                    text: `$${(netDebit * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(leapsPremium * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(shortPremium * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(currentPrice * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `The net investment is the LEAPS premium paid ($${leapsPremium.toFixed(2)}) minus the short call premium received ($${shortPremium.toFixed(2)}) multiplied by 100 shares = $${(netDebit * 100).toFixed(2)}`
        },
        {
            id: 2,
            question: `For your ${symbol} Fig Leaf, what happens if the stock price rises above your short strike of $${shortStrike.toFixed(2)} before the short call expires?`,
            options: [
                {
                    text: `You should consider closing the entire position for a profit`,
                    isCorrect: true
                },
                {
                    text: `Exercise your LEAPS call to cover the assignment`,
                    isCorrect: false
                },
                {
                    text: `Let assignment happen and maintain the LEAPS position`,
                    isCorrect: false
                },
                {
                    text: `Roll the short call to a higher strike price`,
                    isCorrect: false
                }
            ],
            explanation: `If the stock rises above the short strike before expiration, it's often best to close the entire position for a profit rather than risk assignment, as early assignment would require complex management of the LEAPS position.`
        },
        {
            id: 3,
            question: `What's the approximate delta of your ${symbol} LEAPS call at the $${leapsStrike.toFixed(2)} strike, and why is this important?`,
            options: [
                {
                    text: `Around 0.80, making it a good stock substitute`,
                    isCorrect: true
                },
                {
                    text: `Around 0.50, providing balanced exposure`,
                    isCorrect: false
                },
                {
                    text: `Around 0.30, minimizing risk`,
                    isCorrect: false
                },
                {
                    text: `Around 0.95, providing maximum leverage`,
                    isCorrect: false
                }
            ],
            explanation: `The LEAPS call should have a delta of about 0.80 or higher to act as an effective stock substitute, which is why we chose a strike 20% in-the-money at $${leapsStrike.toFixed(2)}.`
        },
        {
            id: 4,
            question: `If ${symbol} drops to $${(currentPrice * 0.85).toFixed(2)} before the short call expires, what's the best action?`,
            options: [
                {
                    text: `Buy back the short call and sell another at a lower strike`,
                    isCorrect: true
                },
                {
                    text: `Exercise the LEAPS call immediately`,
                    isCorrect: false
                },
                {
                    text: `Close the entire position for a loss`,
                    isCorrect: false
                },
                {
                    text: `Add another short call at the same strike`,
                    isCorrect: false
                }
            ],
            explanation: `When the stock price drops significantly, you can buy back the short call (which has lost value) and sell another at a lower strike to continue generating income while maintaining the position.`
        },
        {
            id: 5,
            question: `What's your maximum potential loss on this ${symbol} Fig Leaf position?`,
            options: [
                {
                    text: `$${(netDebit * 100).toFixed(2)} (net debit paid)`,
                    isCorrect: true
                },
                {
                    text: `$${(leapsPremium * 100).toFixed(2)} (LEAPS premium)`,
                    isCorrect: false
                },
                {
                    text: `$${(currentPrice * 100).toFixed(2)} (stock value)`,
                    isCorrect: false
                },
                {
                    text: `Unlimited loss potential`,
                    isCorrect: false
                }
            ],
            explanation: `The maximum loss is limited to your initial net debit of $${(netDebit * 100).toFixed(2)}, which occurs if the stock drops significantly and both options expire worthless.`
        },
        {
            id: 6,
            question: `If ${symbol} is at $${(shortStrike * 1.1).toFixed(2)} at short call expiration, what should you do?`,
            options: [
                {
                    text: `Close both positions to lock in the profit`,
                    isCorrect: true
                },
                {
                    text: `Exercise the LEAPS to cover assignment`,
                    isCorrect: false
                },
                {
                    text: `Roll the short call up and out`,
                    isCorrect: false
                },
                {
                    text: `Let assignment occur naturally`,
                    isCorrect: false
                }
            ],
            explanation: `With the stock above the short strike at $${(shortStrike * 1.1).toFixed(2)}, the position is profitable and should be closed to avoid assignment complications with the LEAPS call.`
        },
        {
            id: 7,
            question: `How does the leverage in your ${symbol} Fig Leaf compare to a regular covered call?`,
            options: [
                {
                    text: `Higher leverage due to lower capital requirement`,
                    isCorrect: true
                },
                {
                    text: `Lower leverage due to option premium costs`,
                    isCorrect: false
                },
                {
                    text: `Same leverage as a covered call`,
                    isCorrect: false
                },
                {
                    text: `No leverage effect`,
                    isCorrect: false
                }
            ],
            explanation: `The Fig Leaf provides higher leverage because you're only paying $${(netDebit * 100).toFixed(2)} instead of $${(currentPrice * 100).toFixed(2)} for a covered call, while still collecting similar call premium.`
        },
        {
            id: 8,
            question: `What happens to your ${symbol} position if you're assigned on the short call?`,
            options: [
                {
                    text: `Sell the LEAPS and buy stock to cover, preserving time value`,
                    isCorrect: true
                },
                {
                    text: `Exercise the LEAPS call immediately`,
                    isCorrect: false
                },
                {
                    text: `Let the stock be called away`,
                    isCorrect: false
                },
                {
                    text: `Roll the short call forward`,
                    isCorrect: false
                }
            ],
            explanation: `If assigned, you should sell the LEAPS call (preserving any remaining time value) and use the proceeds plus additional capital to buy stock to cover the assignment.`
        },
        {
            id: 9,
            question: `If ${symbol} remains at $${currentPrice.toFixed(2)} until short call expiration, what's your best course of action?`,
            options: [
                {
                    text: `Sell another short-term call against your LEAPS`,
                    isCorrect: true
                },
                {
                    text: `Close the entire position`,
                    isCorrect: false
                },
                {
                    text: `Exercise the LEAPS call`,
                    isCorrect: false
                },
                {
                    text: `Buy back the short call only`,
                    isCorrect: false
                }
            ],
            explanation: `With the stock price unchanged, you can continue the strategy by selling another short-term call to generate more premium while maintaining your LEAPS position.`
        },
        {
            id: 10,
            question: `What's the key risk difference between your ${symbol} Fig Leaf and a regular covered call?`,
            options: [
                {
                    text: `The LEAPS call expires worthless if the stock drops significantly`,
                    isCorrect: true
                },
                {
                    text: `The short call has more risk`,
                    isCorrect: false
                },
                {
                    text: `The position has unlimited risk`,
                    isCorrect: false
                },
                {
                    text: `There is no difference in risk`,
                    isCorrect: false
                }
            ],
            explanation: `Unlike stock in a covered call, your LEAPS call can expire worthless if ${symbol} drops significantly, potentially losing your entire $${(netDebit * 100).toFixed(2)} investment.`
        }
    ];
};

export const generateFigLeafQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    console.log('Generating Fig Leaf questions with:', {
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