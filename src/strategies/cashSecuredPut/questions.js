import {shuffleArray} from "@/utils/questions.js";

const generateQuestionBase = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    // Convert string values to numbers and calculate key metrics
    const currentPrice = parseFloat(stockPrice);
    const strike = parseFloat(strikePrice);
    const prem = parseFloat(premium);
    const future = parseFloat(futurePrice);
    const breakEven = strike - prem;
    const maxGain = prem * 100;
    const priceUpTen = currentPrice * 1.10;
    const priceDownTen = currentPrice * 0.90;
    const cashRequired = strike * 100; // Amount needed to secure the put

    return [
        {
            id: 1,
            question: `You sold a cash secured put on ${symbol} with strike $${strike} for $${prem} premium. What is your break-even price?`,
            options: [
                {
                    text: `$${breakEven.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${strike.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(strike + prem).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${currentPrice.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Break-even = Strike Price - Premium = $${strike.toFixed(2)} - $${prem.toFixed(2)} = $${breakEven.toFixed(2)}. This is the price below which you start losing money if assigned.`
        },
        {
            id: 2,
            question: `How much cash must you have secured for this ${symbol} put option?`,
            options: [
                {
                    text: `$${cashRequired.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${(cashRequired - maxGain).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(currentPrice * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${maxGain.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `You must secure $${cashRequired.toFixed(2)} (Strike Price × 100 shares) to cover potential assignment, regardless of the premium received.`
        },
        {
            id: 3,
            question: `If ${symbol} drops to $${priceDownTen.toFixed(2)} halfway to expiration, what's your unrealized loss if assigned?`,
            options: [
                {
                    text: `$${((strike - priceDownTen - prem) * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${((strike - priceDownTen) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${maxGain.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${((currentPrice - priceDownTen) * 100).toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Your loss would be: (Strike Price - Current Price - Premium) × 100 = ($${strike.toFixed(2)} - $${priceDownTen.toFixed(2)} - $${prem.toFixed(2)}) × 100 = $${((strike - priceDownTen - prem) * 100).toFixed(2)}.`
        },
        {
            id: 4,
            question: `${symbol} is now at $${priceDownTen.toFixed(2)}. Should you consider closing the position early?`,
            options: [
                {
                    text: `Yes, to avoid potential further losses if stock continues dropping`,
                    isCorrect: true
                },
                {
                    text: `No, always hold until expiration to keep full premium`,
                    isCorrect: false
                },
                {
                    text: `No, the loss is just on paper`,
                    isCorrect: false
                },
                {
                    text: `Yes, and sell another put at a lower strike`,
                    isCorrect: false
                }
            ],
            explanation: `With the stock below your strike price, closing early can prevent larger losses if the stock continues to fall. Managing risk is often more important than maximizing premium.`
        },
        {
            id: 5,
            question: `What's your maximum potential gain on this ${symbol} cash secured put?`,
            options: [
                {
                    text: `$${maxGain.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${cashRequired.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(strike * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Unlimited gain`,
                    isCorrect: false
                }
            ],
            explanation: `Maximum gain is limited to the premium received: $${prem.toFixed(2)} × 100 shares = $${maxGain.toFixed(2)}. This occurs if the stock stays above the strike price.`
        },
        {
            id: 6,
            question: `If ${symbol} expires at $${future.toFixed(2)}, will you be assigned shares?`,
            options: [
                {
                    text: `Yes, you'll buy 100 shares at $${strike.toFixed(2)} per share`,
                    isCorrect: future < strike
                },
                {
                    text: `No, you keep the premium and avoid assignment`,
                    isCorrect: future >= strike
                },
                {
                    text: `Maybe, it depends on the buyer's decision`,
                    isCorrect: false
                },
                {
                    text: `No, you can choose to decline assignment`,
                    isCorrect: false
                }
            ],
            explanation: future < strike ?
                `Since $${future.toFixed(2)} is below the strike price of $${strike.toFixed(2)}, you'll be assigned and must buy 100 shares at the strike price.` :
                `Since $${future.toFixed(2)} is above the strike price of $${strike.toFixed(2)}, the put expires worthless and you keep the full premium.`
        },
        {
            id: 7,
            question: `What's your return on investment (ROI) if ${symbol} stays above $${strike.toFixed(2)} until expiration?`,
            options: [
                {
                    text: `${((maxGain / cashRequired) * 100).toFixed(2)}%`,
                    isCorrect: true
                },
                {
                    text: `${((maxGain / (currentPrice * 100)) * 100).toFixed(2)}%`,
                    isCorrect: false
                },
                {
                    text: `${((prem / strike) * 100).toFixed(2)}%`,
                    isCorrect: false
                },
                {
                    text: `100%`,
                    isCorrect: false
                }
            ],
            explanation: `ROI = (Premium / Cash Secured) × 100 = ($${maxGain.toFixed(2)} / $${cashRequired.toFixed(2)}) × 100 = ${((maxGain / cashRequired) * 100).toFixed(2)}%. This represents return on the cash you must set aside.`
        },
        {
            id: 8,
            question: `If ${symbol} drops significantly below your put strike of $${strike.toFixed(2)}, which action might be best?`,
            options: [
                {
                    text: `Close the position and preserve capital`,
                    isCorrect: true
                },
                {
                    text: `Wait for assignment no matter what`,
                    isCorrect: false
                },
                {
                    text: `Sell another put at a lower strike`,
                    isCorrect: false
                },
                {
                    text: `Buy shares at market price`,
                    isCorrect: false
                }
            ],
            explanation: `When a stock drops significantly below your put strike, closing the position can prevent larger losses and free up capital for better opportunities. The premium received doesn't justify holding a losing position indefinitely.`
        },
        {
            id: 9,
            question: `How does your cost basis compare to the current market price if ${symbol} gets assigned at $${strike.toFixed(2)}?`,
            options: [
                {
                    text: `$${breakEven.toFixed(2)} vs market price of $${future.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `$${strike.toFixed(2)} vs market price of $${future.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${currentPrice.toFixed(2)} vs market price of $${future.toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `$${(strike + prem).toFixed(2)} vs market price of $${future.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `Your effective cost basis is the strike price minus the premium received ($${breakEven.toFixed(2)}). This is what you compare to the market price to determine your position's profit or loss.`
        },
        {
            id: 10,
            question: `What percentage of your cash secured amount ($${cashRequired.toFixed(2)}) are you risking if ${symbol} goes to zero?`,
            options: [
                {
                    text: `${((strike - prem) / strike * 100).toFixed(2)}%`,
                    isCorrect: true
                },
                {
                    text: `100%`,
                    isCorrect: false
                },
                {
                    text: `${((prem / strike) * 100).toFixed(2)}%`,
                    isCorrect: false
                },
                {
                    text: `0%`,
                    isCorrect: false
                }
            ],
            explanation: `Maximum risk is strike price minus premium ($${(strike - prem).toFixed(2)} per share or $${((strike - prem) * 100).toFixed(2)} total), which is ${((strike - prem) / strike * 100).toFixed(2)}% of your secured cash. The premium received slightly reduces your total risk.`
        }
    ];
};

export const generateCashSecuredPutQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
    console.log('Generating Cash Secured Put questions with:', {
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