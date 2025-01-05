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

    // Calculate buy back scenarios
    const buyBackPrice = prem * 0.3; // Assume we can buy back at 30% of original premium
    const buyBackSavings = (prem - buyBackPrice) * 100;

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
            question: `You bought ${symbol} at $${currentPrice} and sold a $${strike} call for $${prem} premium. If ${symbol} drops to $${(currentPrice * 0.8).toFixed(2)} at expiration, what's your actual loss per share compared to just holding the stock?`,
            options: [
                {
                    text: `$${(currentPrice * 0.8 - (currentPrice - prem)).toFixed(2)} loss with covered call vs $${(currentPrice * 0.8 - currentPrice).toFixed(2)} loss with stock only`,
                    isCorrect: true
                },
                {
                    text: `$${(currentPrice * 0.8 - currentPrice).toFixed(2)} loss for both strategies`,
                    isCorrect: false
                },
                {
                    text: `$${(prem).toFixed(2)} profit with covered call vs $${(currentPrice * 0.8 - currentPrice).toFixed(2)} loss with stock only`,
                    isCorrect: false
                },
                {
                    text: `$${(currentPrice - currentPrice * 0.8).toFixed(2)} loss for both strategies`,
                    isCorrect: false
                }
            ],
            explanation: `With a covered call, your cost basis is reduced from $${currentPrice} to $${(currentPrice - prem).toFixed(2)} due to the premium received. At $${(currentPrice * 0.8).toFixed(2)}, your actual loss is $${(currentPrice * 0.8 - (currentPrice - prem)).toFixed(2)} per share. Without the covered call, you would lose $${(currentPrice * 0.8 - currentPrice).toFixed(2)} per share. The premium received ($${prem}) provides this much downside protection.`
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
        },
        {
            id: 6,
            question: `If ${symbol} changes from $${currentPrice.toFixed(2)} to $${(Math.min(strike - 0.01, priceUpTen)).toFixed(2)} (below the $${strike} strike price), compare your returns: holding 100 shares versus a covered call strategy that collects $${(prem * 100).toFixed(2)} premium.`,
            options: [
                {
                    text: `Stock only: $${((Math.min(strike - 0.01, priceUpTen) - currentPrice) * 100).toFixed(2)} profit vs. Covered Call: $${((Math.min(strike - 0.01, priceUpTen) - currentPrice) * 100 + (prem * 100)).toFixed(2)} profit`,
                    isCorrect: true
                },
                {
                    text: `Both strategies would earn $${((Math.min(strike - 0.01, priceUpTen) - currentPrice) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Stock only: $${((Math.min(strike - 0.01, priceUpTen) - currentPrice) * 100).toFixed(2)} profit vs. Covered Call: $${(prem * 100).toFixed(2)} profit`,
                    isCorrect: false
                },
                {
                    text: `Stock only: $${(Math.min(strike - 0.01, priceUpTen) * 100).toFixed(2)} profit vs. Covered Call: $${((strike * 100) + (prem * 100)).toFixed(2)} profit`,
                    isCorrect: false
                }
            ],
            explanation: `With stock only, your profit is the price increase: ($${(Math.min(strike - 0.01, priceUpTen)).toFixed(2)} - $${currentPrice.toFixed(2)}) × 100 = $${((Math.min(strike - 0.01, priceUpTen) - currentPrice) * 100).toFixed(2)}. With a covered call, you keep both this stock appreciation AND the premium collected: $${((Math.min(strike - 0.01, priceUpTen) - currentPrice) * 100).toFixed(2)} + $${(prem * 100).toFixed(2)} = $${((Math.min(strike - 0.01, priceUpTen) - currentPrice) * 100 + (prem * 100)).toFixed(2)}. This shows how covered calls can enhance returns when the stock price rises but stays below the strike price.`
        },
        {
            id: 7,
            question: `${symbol} drops to $${priceDownTen.toFixed(2)} halfway to expiration, and your sold call is now worth $${buyBackPrice.toFixed(2)}. Should you consider buying back the call?`,
            options: [
                {
                    text: `Yes, buy it back and save $${buyBackSavings.toFixed(2)} in premium, potentially reselling a new call later`,
                    isCorrect: true
                },
                {
                    text: `No, keep the original position as the stock might recover`,
                    isCorrect: false
                },
                {
                    text: `No, the loss on the stock negates any benefit from the call`,
                    isCorrect: false
                },
                {
                    text: `Yes, buy it back and sell the stock immediately`,
                    isCorrect: false
                }
            ],
            explanation: `With the stock down significantly, the call option's value has decreased to $${buyBackPrice.toFixed(2)}. Buying it back saves $${buyBackSavings.toFixed(2)} of the original premium, and you could potentially sell another call at a lower strike price to generate new premium income.`
        },
        {
            id: 8,
            question: `In the scenario where ${symbol} drops to $${priceDownTen.toFixed(2)}, let's analyze the covered call management. You originally sold the call for $${prem.toFixed(2)} (premium received = $${(prem * 100).toFixed(2)}) and can now buy it back for $${buyBackPrice.toFixed(2)} (cost = $${(buyBackPrice * 100).toFixed(2)}). What's the return on investment (ROI) if you buy back the call?`,
            options: [
                {
                    text: `${((buyBackSavings / (prem * 100)) * 100).toFixed(2)}% on the option component ($${buyBackSavings.toFixed(2)} profit / $${(prem * 100).toFixed(2)} initial premium)`,
                    isCorrect: true
                },
                {
                    text: `${((priceDownTen - currentPrice) / currentPrice * 100).toFixed(2)}% (stock loss only: $${((priceDownTen - currentPrice) * 100).toFixed(2)})`,
                    isCorrect: false
                },
                {
                    text: `${(((priceDownTen - currentPrice + prem) / currentPrice) * 100).toFixed(2)}% (stock loss plus original premium: $${((priceDownTen - currentPrice) * 100 + prem * 100).toFixed(2)})`,
                    isCorrect: false
                },
                {
                    text: `0% as the loss on stock offsets option gains`,
                    isCorrect: false
                }
            ],
            explanation: `Let's break down the ROI calculation:
1. Original premium received: $${(prem * 100).toFixed(2)}
2. Buy-back cost: $${(buyBackPrice * 100).toFixed(2)}
3. Premium saved/profit: $${buyBackSavings.toFixed(2)}
4. ROI = (Premium Saved / Original Premium) × 100
   = ($${buyBackSavings.toFixed(2)} / $${(prem * 100).toFixed(2)}) × 100
   = ${((buyBackSavings / (prem * 100)) * 100).toFixed(2)}%

While the stock position shows a loss of ${((priceDownTen - currentPrice) / currentPrice * 100).toFixed(2)}%, managing the option position independently has resulted in a profit on the option component.`
        },
        {
            id: 9,
            question: `If you buy back the ${symbol} call for $${buyBackPrice.toFixed(2)} when the stock is at $${priceDownTen.toFixed(2)}, and you believe the stock will remain range-bound between $${(priceDownTen * 0.95).toFixed(2)} and $${(priceDownTen * 1.05).toFixed(2)} for the next month, what's the most appropriate action to maximize income while holding the stock?`,
            options: [
                {
                    text: `Sell a new covered call at a lower strike price (around $${(priceDownTen * 1.02).toFixed(2)}) to generate additional premium while the stock trades sideways`,
                    isCorrect: true
                },
                {
                    text: `Wait for the stock to recover to $${currentPrice.toFixed(2)} before selling another call, missing out on potential premium in the meantime`,
                    isCorrect: false
                },
                {
                    text: `Sell the stock immediately at $${priceDownTen.toFixed(2)} and take the loss`,
                    isCorrect: false
                },
                {
                    text: `Buy another call option, which would increase your risk and cost basis`,
                    isCorrect: false
                }
            ],
            explanation: `Given the expectation of range-bound trading, selling a new covered call at a lower strike price (around $${(priceDownTen * 1.02).toFixed(2)}) is optimal because: 1. It generates immediate premium income to help offset the stock decline. 2. With sideways trading expected, the new premium has a high probability of being retained. 3. The lower strike price reflects the new trading range while still allowing for some upside. 4. If the stock does recover sharply, you can manage the position again by rolling up. This strategy maximizes income potential while maintaining the position in a sideways market.`
        },
        {
            id: 10,
            question: `For ${symbol}, you bought shares at $${currentPrice.toFixed(2)} and sold a call at strike $${strike.toFixed(2)} for $${prem.toFixed(2)} premium. The stock rises sharply to $${(strike * 1.20).toFixed(2)} (20% above strike), and the call now costs $${(strike * 0.22).toFixed(2)} to buy back. What should you do?`,
            options: [
                {
                    text: `Buy back the call despite a $${((strike * 0.22 - prem) * 100).toFixed(2)} loss to capture the stock's upside potential`,
                    isCorrect: true
                },
                {
                    text: `Let the shares be called away at $${strike.toFixed(2)}, limiting your profit to $${((strike - currentPrice + prem) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Sell the stock at $${(strike * 1.20).toFixed(2)} while keeping the short call open`,
                    isCorrect: false
                },
                {
                    text: `Wait until expiration, since the premium received offsets any lost stock gains`,
                    isCorrect: false
                }
            ],
            explanation: `When a stock shows strong upward momentum, it may be worth buying back the call even at a loss. Here, letting the stock be called away limits your profit to $${((strike - currentPrice + prem) * 100).toFixed(2)}, while buying back the call for a $${((strike * 0.22 - prem) * 100).toFixed(2)} loss allows you to capture all future gains above $${(strike * 1.20).toFixed(2)}. The loss on the call could be recovered by just a small additional move higher in the stock.`
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