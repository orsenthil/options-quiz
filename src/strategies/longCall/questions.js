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
                    text: future > strike
                        ? `Profit of $${((future - strike) * 100 - maxLoss).toFixed(2)}`
                        : `Loss of $${maxLoss.toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: future > currentPrice
                        ? `Profit of $${((future - currentPrice) * 100).toFixed(2)}`
                        : `Loss of $${((currentPrice - future) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: future > strike
                        ? `Profit of $${((future - strike) * 100).toFixed(2)}`
                        : `Loss of $${((strike - future) * 100).toFixed(2)}`,
                    isCorrect: false
                },
                {
                    text: `Profit of $${maxLoss.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: future > strike
                ? `The stock closed above the strike price ($${strike.toFixed(2)}), so your call option was in-the-money. Your profit calculation is:
           1. Option value at expiration = (Final Price - Strike Price) × 100 shares
           2. Option value = ($${future.toFixed(2)} - $${strike.toFixed(2)}) × 100 = $${((future - strike) * 100).toFixed(2)}
           3. Final P/L = Option value - Premium paid
           4. P/L = $${((future - strike) * 100).toFixed(2)} - $${maxLoss.toFixed(2)} = $${((future - strike) * 100 - maxLoss).toFixed(2)}`
                : `The stock closed below the strike price ($${strike.toFixed(2)}), so your call option expired worthless (out-of-the-money). In this case, you lose the entire premium paid: -$${maxLoss.toFixed(2)}. This is the maximum loss possible on a long call option.`
        },
        {
            id: 6,
            question: `Between ${selectedDate} and ${expirationDate}, ${symbol} moved from $${currentPrice} to $${futurePrice}. What was your return on investment (ROI) for this call option trade?`,
            options: [
                {
                    text: future > strike
                        ? `Gain of ${(((future - strike) * 100 - maxLoss) / maxLoss * 100).toFixed(2)}% (based on premium invested)`
                        : `Loss of 100% (total premium lost)`,
                    isCorrect: true
                },
                {
                    text: `${((future - currentPrice) / currentPrice * 100).toFixed(2)}% (stock price return)`,
                    isCorrect: false
                },
                {
                    text: future > strike
                        ? `Gain of ${((future - strike) / strike * 100).toFixed(2)}% (from strike price)`
                        : `Loss of ${((strike - future) / strike * 100).toFixed(2)}% (from strike price)`,
                    isCorrect: false
                },
                {
                    text: future > strike
                        ? `Gain of ${((future - currentPrice) / maxLoss * 100).toFixed(2)}% (price change / premium)`
                        : `Loss of ${((currentPrice - future) / maxLoss * 100).toFixed(2)}% (price change / premium)`,
                    isCorrect: false
                }
            ],
            explanation: future > strike
                ? `ROI = (Profit / Premium Paid) × 100. With final value of $${((future - strike) * 100).toFixed(2)} and premium paid of $${maxLoss.toFixed(2)}, your ROI is ${(((future - strike) * 100 - maxLoss) / maxLoss * 100).toFixed(2)}%.`
                : `Since the option expired worthless, you lost your entire premium of $${maxLoss.toFixed(2)}, resulting in an ROI of -100%.`
        },
        {
            id: 7,
            question: `Your ${symbol} long call with strike $${strike.toFixed(2)} has gained value. The stock is at $${(strike * 1.15).toFixed(2)}, and your option can be sold for $${(strike * 0.18).toFixed(2)} (original premium paid: $${prem.toFixed(2)}). Should you close early?`,
            options: [
                {
                    text: `Yes, lock in a profit of $${((strike * 0.18 - prem) * 100).toFixed(2)} now rather than risk time decay`,
                    isCorrect: true
                },
                {
                    text: `No, hold until expiration for maximum profit potential`,
                    isCorrect: false
                },
                {
                    text: `No, wait for the stock to reach $${(strike * 1.25).toFixed(2)} first`,
                    isCorrect: false
                },
                {
                    text: `Exercise the option immediately to own the shares`,
                    isCorrect: false
                }
            ],
            explanation: `With the option showing a profit of $${((strike * 0.18 - prem) * 100).toFixed(2)} (($${(strike * 0.18).toFixed(2)} - $${prem.toFixed(2)}) × 100), it's often wise to close early. This locks in gains and avoids theta decay, especially if implied volatility is high. Remember: you don't need to hold options to expiration to profit.`
        },
        {
            id: 8,
            question: `Your ${symbol} call option has lost value, with the stock dropping to $${priceDownTen.toFixed(2)}. The option now trades at $${(prem * 0.4).toFixed(2)} (original premium: $${prem.toFixed(2)}). What's the best action?`,
            options: [
                {
                    text: `Sell the option to salvage $${(prem * 0.4 * 100).toFixed(2)} of your initial investment`,
                    isCorrect: true
                },
                {
                    text: `Hold until expiration hoping for recovery`,
                    isCorrect: false
                },
                {
                    text: `Buy another call to average down your cost`,
                    isCorrect: false
                },
                {
                    text: `Exercise the option to buy shares at $${strike.toFixed(2)}`,
                    isCorrect: false
                }
            ],
            explanation: `When a long call moves significantly out-of-the-money, selling to salvage remaining value ($${(prem * 0.4 * 100).toFixed(2)}) can be prudent. This reduces your maximum loss from $${(prem * 100).toFixed(2)} to $${((prem - prem * 0.4) * 100).toFixed(2)} and frees up capital for other opportunities.`
        },
        {
            id: 9,
            question: `Your ${symbol} call has doubled in value due to increased volatility, trading at $${(prem * 2).toFixed(2)} (cost basis: $${prem.toFixed(2)}). The stock price is still near $${(currentPrice * 1.02).toFixed(2)}. What should you consider?`,
            options: [
                {
                    text: `Sell the call to profit from the volatility spike, potential gain: $${(prem * 100).toFixed(2)}`,
                    isCorrect: true
                },
                {
                    text: `Hold the position since the stock hasn't moved much`,
                    isCorrect: false
                },
                {
                    text: `Buy more calls at the higher premium`,
                    isCorrect: false
                },
                {
                    text: `Exercise the option early`,
                    isCorrect: false
                }
            ],
            explanation: `When implied volatility causes your option to double in value without significant stock movement, it's often profitable to sell. You're capturing $${(prem * 100).toFixed(2)} profit from volatility expansion alone, which could decrease even if the stock moves favorably later.`
        },
        {
            id: 10,
            question: `You bought a ${symbol} $${strike.toFixed(2)} call for $${prem.toFixed(2)}. Now the stock is at $${(strike * 1.1).toFixed(2)}, and a major earnings report is coming. The call is worth $${(prem * 1.8).toFixed(2)}. What's the strategic consideration?`,
            options: [
                {
                    text: `Sell before earnings to lock in $${((prem * 1.8 - prem) * 100).toFixed(2)} profit and avoid earnings volatility risk`,
                    isCorrect: true
                },
                {
                    text: `Hold through earnings for potentially larger gains`,
                    isCorrect: false
                },
                {
                    text: `Exercise the option before earnings`,
                    isCorrect: false
                },
                {
                    text: `Buy more calls to increase potential earnings gains`,
                    isCorrect: false
                }
            ],
            explanation: `With a profit of $${((prem * 1.8 - prem) * 100).toFixed(2)} before earnings, selling is often prudent. Earnings events can cause dramatic moves in both stock price and volatility. Even if the stock rises, your option could lose value if implied volatility drops post-earnings (volatility crush).`
        }
    ];
};

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