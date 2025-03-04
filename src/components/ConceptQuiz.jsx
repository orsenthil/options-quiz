import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveScore } from '../services/scoreService';
import { Button } from './ui/button';
import { STRATEGY_TYPES } from '../strategies/types';
import { generateLongCallQuestions } from '../strategies/longCall/questions';
import { generateCoveredCallQuestions } from '../strategies/coveredCall/questions';
import {generateOptionsTheoryQuestions} from "@/strategies/optionsTheory/questions.js";
import {generateCollarStrategyQuestions} from "@/strategies/collarStrategy/questions.js";
import {generateCashSecuredPutQuestions} from "@/strategies/cashSecuredPut/questions.js";
import {generateProtectivePutQuestions} from "@/strategies/protectivePut/questions.js";
import {generateLongPutQuestions} from "@/strategies/longPut/questions.js";
import {generateLongCallSpreadQuestions} from "@/strategies/longCallSpread/questions.js";
import {generateLongPutSpreadQuestions} from "@/strategies/longPutSpread/questions.js";
import {generateFigLeafQuestions} from "@/strategies/figLeaf/questions.js";


const ConceptQuiz = ({ stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate, strategy }) => {
    const { user } = useAuth();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);

    // Log props whenever they change
    useEffect(() => {
        console.log('ConceptQuiz received props:', {
            stockPrice,
            strikePrice,
            premium,
            symbol,
            futurePrice,
            expirationDate,
            selectedDate
        });
    }, [stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate]);

    // Generate questions only when props change
    const questions = useMemo(() => {

        console.log('Generating questions with props:', {
            stockPrice,
            strikePrice,
            premium,
            symbol,
            futurePrice,
            expirationDate,
            selectedDate
        });

        // Check if all required props are available
        const allPropsAvailable = Boolean(
            stockPrice &&
            strikePrice &&
            premium &&
            symbol &&
            futurePrice &&
            expirationDate &&
            selectedDate
        );

        console.log('All props available:', allPropsAvailable);

        if (allPropsAvailable) {
            console.log("All props available: ", allPropsAvailable);

            switch (strategy) {
                case STRATEGY_TYPES.LONG_CALL:
                    console.log("Selecting generate Long Call");
                    return generateLongCallQuestions(
                        stockPrice,
                        strikePrice,
                        premium,
                        symbol,
                        futurePrice,
                        expirationDate,
                        selectedDate
                    );
                case STRATEGY_TYPES.COVERED_CALL:
                    console.log("Selecting Covered Call");
                    return generateCoveredCallQuestions(
                        stockPrice,
                        strikePrice,
                        premium,
                        symbol,
                        futurePrice,
                        expirationDate,
                        selectedDate
                    );
                case STRATEGY_TYPES.OPTIONS_THEORY:
                    console.log("Selecting Options Theory");
                    return generateOptionsTheoryQuestions(
                        stockPrice,
                        strikePrice,
                        premium,
                        symbol,
                        futurePrice,
                        expirationDate,
                        selectedDate
                    );
                case STRATEGY_TYPES.COLLAR_STRATEGY:
                    console.log("Selecting Collar Strategy");
                    return generateCollarStrategyQuestions(
                        stockPrice,
                        strikePrice,
                        premium,
                        symbol,
                        futurePrice,
                        expirationDate,
                        selectedDate
                    );
                case STRATEGY_TYPES.CASH_SECURED_PUT:
                    console.log("Selecting Cash Secured Put");
                    return generateCashSecuredPutQuestions(
                        stockPrice,
                        strikePrice,
                        premium,
                        symbol,
                        futurePrice,
                        expirationDate,
                        selectedDate
                    );
                case STRATEGY_TYPES.PROTECTIVE_PUT:
                    console.log("Selecting Protectivated Put");
                    return generateProtectivePutQuestions(
                        stockPrice,
                        strikePrice,
                        premium,
                        symbol,
                        futurePrice,
                        expirationDate,
                        selectedDate
                    );
                case STRATEGY_TYPES.LONG_PUT:
                    console.log("Selecting Long Put");
                    return generateLongPutQuestions(
                        stockPrice,
                        strikePrice,
                        premium,
                        symbol,
                        futurePrice,
                        expirationDate,
                        selectedDate
                    );
                case STRATEGY_TYPES.LONG_CALL_SPREAD:
                    console.log("Selecting Long Call Spread");
                    return generateLongCallSpreadQuestions(
                        stockPrice,
                        strikePrice,
                        premium,
                        symbol,
                        futurePrice,
                        expirationDate,
                        selectedDate
                    );
                case STRATEGY_TYPES.LONG_PUT_SPREAD:
                    console.log("Selecting Long Put Spread");
                    return generateLongPutSpreadQuestions(
                        stockPrice,
                        strikePrice,
                        premium,
                        symbol,
                        futurePrice,
                        expirationDate,
                        selectedDate
                    );
                case STRATEGY_TYPES.FIG_LEAF:
                    console.log("Selecting Fig Leaf Strategy");
                    return generateFigLeafQuestions(
                        stockPrice,
                        strikePrice,
                        premium,
                        symbol,
                        futurePrice,
                        expirationDate,
                        selectedDate
                    );
                default:
                    return [];

            }
        }

        return [];
    }, [stockPrice, strikePrice, premium, symbol, futurePrice, expirationDate, selectedDate, strategy]);

    useEffect(() => {
        console.log('Questions array updated:', questions);
    }, [questions]);

    const handleAnswerSelect = (answerIndex) => {
        setSelectedAnswer(answerIndex);
        setShowExplanation(true);

        if (answerIndex === questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    };

    const handleQuizComplete = async () => {
        if (user) {
            try {
                await saveScore(
                    user.uid,
                    score,
                    questions.length,
                    symbol,
                    selectedDate
                );
            } catch (error) {
                console.error('Error saving score:', error);
            }
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
    };

    useEffect(() => {
        if (currentQuestion === questions.length - 1 && showExplanation) {
            handleQuizComplete();
        }
    }, [currentQuestion, showExplanation, questions.length]);

    if (questions.length === 0) {
        console.log('Rendering empty state - no questions available');
        return (
            <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p>Generate a question to see practical scenarios based on real market data.</p>
            </div>
        );
    }

    console.log('Rendering question:', currentQuestion);
    const question = questions[currentQuestion];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Practice Scenarios</h3>
                <span className="text-sm text-blue-600">Score: {score}/{questions.length}</span>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <p className="font-medium mb-4">{question.question}</p>

                <div className="space-y-2">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showExplanation}
                            className={`w-full p-3 text-left rounded ${
                                showExplanation
                                    ? index === question.correctAnswer
                                        ? 'bg-green-100 border-green-500'
                                        : index === selectedAnswer
                                            ? 'bg-red-100 border-red-500'
                                            : 'bg-gray-50'
                                    : 'bg-gray-50 hover:bg-purple-50'
                            } border transition-colors`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {showExplanation && (
                    <div className="mt-4 p-4 bg-purple-50 rounded">
                        <p className="text-sm">{question.explanation}</p>
                    </div>
                )}

                {showExplanation && (
                    <div className="mt-4 flex justify-end">
                        {currentQuestion < questions.length - 1 ? (
                            <Button
                                onClick={handleNextQuestion}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Next Question
                            </Button>
                        ) : (
                            <Button
                                onClick={handleRestartQuiz}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Try New Scenarios
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConceptQuiz;