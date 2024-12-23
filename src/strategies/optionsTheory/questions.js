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

    const contractSize = 100; // Standard contract size
    const totalPremium = prem * contractSize;

    return [
        {
            id: 1,
            question: `For ${symbol} trading at $${currentPrice}, which best describes your rights if you buy a call option with strike price $${strike}?`,
            options: [
                {
                    text: `Right to buy ${symbol} at $${strike} regardless of how high the stock price goes`,
                    isCorrect: true
                },
                {
                    text: `Obligation to buy ${symbol} at $${strike} if the stock goes up`,
                    isCorrect: false
                },
                {
                    text: `Right to sell ${symbol} at $${strike} if the stock goes down`,
                    isCorrect: false
                },
                {
                    text: `Right to buy ${symbol} at $${currentPrice} anytime before expiration`,
                    isCorrect: false
                }
            ],
            explanation: `When buying a call option on ${symbol}, you have the right (but not obligation) to buy the stock at the strike price of $${strike}, even if the stock price rises significantly above this level. Your maximum loss is limited to the premium paid of $${totalPremium.toFixed(2)}.`
        },
        {
            id: 2,
            question: `If ${symbol} is trading at $${currentPrice} now, when would the $${strike} call option be considered in-the-money (ITM)?`,
            options: [
                {
                    text: `When ${symbol} trades above $${strike}`,
                    isCorrect: true
                },
                {
                    text: `When ${symbol} trades below $${strike}`,
                    isCorrect: false
                },
                {
                    text: `When ${symbol} trades exactly at $${strike}`,
                    isCorrect: false
                },
                {
                    text: `When ${symbol} trades above $${breakEven.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `A call option is in-the-money when the stock price is above the strike price. For this ${symbol} option, any price above $${strike} means the option has intrinsic value, though you need the price above $${breakEven.toFixed(2)} to be profitable after considering the premium paid.`
        },
        {
            id: 3,
            question: `Given the $${premium} premium for this ${symbol} option, what's the break-even price at expiration?`,
            options: [
                {
                    text: `$${breakEven.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${strike}`,
                    isCorrect: false
                },
                {
                    text: `$${currentPrice}`,
                    isCorrect: false
                },
                {
                    text: `$${(strike - prem).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `The break-even price for a call option at expiration is the strike price ($${strike}) plus the premium paid per share ($${premium}), which equals $${breakEven.toFixed(2)}. At this price, the intrinsic value exactly equals the premium paid.`
        },
        {
            id: 4,
            question: `If you sell a put option on ${symbol} with a $${strike} strike price, what is your obligation?`,
            options: [
                {
                    text: `To buy ${symbol} at $${strike} if assigned, requiring $${(strike * contractSize).toFixed(2)} in cash`,
                    isCorrect: true
                },
                {
                    text: `To sell ${symbol} at $${strike} if the stock price rises`,
                    isCorrect: false
                },
                {
                    text: `To pay the difference if ${symbol} falls below $${strike}`,
                    isCorrect: false
                },
                {
                    text: `To buy ${symbol} at the market price if assigned`,
                    isCorrect: false
                }
            ],
            explanation: `When selling a put option on ${symbol}, you are obligated to buy 100 shares at the strike price ($${strike}) if assigned, requiring $${(strike * contractSize).toFixed(2)} in cash. This is true regardless of how low the stock price might fall.`
        },
        {
            id: 5,
            question: `For the ${symbol} option expiring on ${expirationDate}, what happens to the time value portion of the $${premium} premium as we approach expiration?`,
            options: [
                {
                    text: "Time value consistently decreases as expiration approaches",
                    isCorrect: true
                },
                {
                    text: "Time value increases as expiration approaches",
                    isCorrect: false
                },
                {
                    text: "Time value stays constant until expiration day",
                    isCorrect: false
                },
                {
                    text: "Time value fluctuates randomly until expiration",
                    isCorrect: false
                }
            ],
            explanation: `The time value portion of your $${premium} premium will decay (decrease) as we approach the ${expirationDate} expiration, with the decay accelerating in the final weeks. At expiration, only intrinsic value (if any) remains.`
        },
        {
            id: 6,
            question: `If implied volatility increases after you buy the ${symbol} $${strike} call option for $${premium}, what typically happens to the option's price?`,
            options: [
                {
                    text: "The option's price typically increases",
                    isCorrect: true
                },
                {
                    text: "The option's price typically decreases",
                    isCorrect: false
                },
                {
                    text: "The option's price remains unchanged",
                    isCorrect: false
                },
                {
                    text: "The option's intrinsic value changes",
                    isCorrect: false
                }
            ],
            explanation: `An increase in implied volatility typically increases the option's price, assuming all other factors remain constant. This would increase the time value portion of your ${symbol} option above the initial $${premium} premium paid.`
        },
        {
            id: 7,
            question: `What is the maximum possible loss when buying this ${symbol} call option with $${strike} strike price?`,
            options: [
                {
                    text: `$${totalPremium.toFixed(2)} (the total premium paid)`,
                    isCorrect: true
                },
                {
                    text: `$${(strike * contractSize).toFixed(2)} (the strike price value)`,
                    isCorrect: false
                },
                {
                    text: `$${(currentPrice * contractSize).toFixed(2)} (the current stock value)`,
                    isCorrect: false
                },
                {
                    text: "Unlimited loss potential",
                    isCorrect: false
                }
            ],
            explanation: `When buying this call option on ${symbol}, your maximum loss is limited to the total premium paid of $${totalPremium.toFixed(2)} ($${premium} × 100 shares). This occurs if the stock is below $${strike} at expiration.`
        },
        {
            id: 8,
            question: `On ${expirationDate}, ${symbol} closed at $${futurePrice}. What term describes the $${strike} call option's status?`,
            options: [
                {
                    text: future > strike ? "In-the-money (ITM)" : future < strike ? "Out-of-the-money (OTM)" : "At-the-money (ATM)",
                    isCorrect: true
                },
                {
                    text: future > strike ? "Out-of-the-money (OTM)" : "In-the-money (ITM)",
                    isCorrect: false
                },
                {
                    text: "Equal-to-the-money",
                    isCorrect: false
                },
                {
                    text: future > breakEven ? "Profitable" : "Unprofitable",
                    isCorrect: false
                }
            ],
            explanation: `With ${symbol} closing at $${futurePrice} and the strike at $${strike}, the option was ${future > strike ? "in-the-money by $" + (future - strike).toFixed(2) + " per share" : future < strike ? "out-of-the-money by $" + (strike - future).toFixed(2) + " per share" : "exactly at-the-money"}.`
        },
        {
            id: 9,
            question: `From ${selectedDate} to ${expirationDate}, ${symbol} moved from $${currentPrice} to $${futurePrice}. What was the better choice?`,
            options: [
                {
                    text: future > breakEven ?
                        `Buying the call option (profit: $${((future - strike - prem) * contractSize).toFixed(2)})` :
                        `Buying the stock directly (profit: $${((future - currentPrice) * contractSize).toFixed(2)})`,
                    isCorrect: true
                },
                {
                    text: future > breakEven ?
                        `Buying the stock (profit: $${((future - currentPrice) * contractSize).toFixed(2)})` :
                        `Buying the call option (loss: $${totalPremium.toFixed(2)})`,
                    isCorrect: false
                },
                {
                    text: "Neither - staying in cash",
                    isCorrect: false
                },
                {
                    text: "Both would have the same profit",
                    isCorrect: false
                }
            ],
            explanation: `With ${symbol} moving from $${currentPrice} to $${futurePrice}:
            Stock P/L: $${((future - currentPrice) * contractSize).toFixed(2)}
            Option P/L: $${future > strike ? ((future - strike - prem) * contractSize).toFixed(2) : -totalPremium.toFixed(2)}`
        },
        {
            id: 10,
            question: `For this ${symbol} option between ${selectedDate} and ${expirationDate}, what factor most affected the time value?`,
            options: [
                {
                    text: Math.abs(future - currentPrice) > (currentPrice * 0.1) ?
                        "The significant price movement of the underlying stock" :
                        "Time decay as expiration approached",
                    isCorrect: true
                },
                {
                    text: "The strike price selection",
                    isCorrect: false
                },
                {
                    text: "The contract size of 100 shares",
                    isCorrect: false
                },
                {
                    text: "The original purchase price",
                    isCorrect: false
                }
            ],
            explanation: Math.abs(future - currentPrice) > (currentPrice * 0.1) ?
                `The significant move in ${symbol} from $${currentPrice} to $${futurePrice} had the largest impact on the option's value.` :
                `With ${symbol} moving only from $${currentPrice} to $${futurePrice}, time decay was the primary factor affecting the option's value.`
        }
    ];
};

/// export const generateLongCallQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {

// This is the exported function that will be called once when generating questions
export const generateOptionsTheoryQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
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