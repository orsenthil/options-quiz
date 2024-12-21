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
    ];
};

/// export const generateLongCallQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {

// This is the exported function that will be called once when generating questions
export const generateCollarStrategyQuestions = (stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate) => {
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