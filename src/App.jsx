import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { AlertCircle, Loader } from "lucide-react";
import ConceptQuiz from './components/ConceptQuiz';
import ProfitLossChart from './components/ProfitLossChart';

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

const generatePriceLevels = (currentPrice) => {
  const prices = [];
  const basePrice = parseFloat(currentPrice);
  prices.push(
      (basePrice * 0.9).toFixed(2),
      basePrice.toFixed(2),
      (basePrice * 1.1).toFixed(2)
  );
  return prices;
};

const calculatePL = (stockPrice, strikePrice, premium) => {
  const price = parseFloat(stockPrice);
  const strike = parseFloat(strikePrice);
  const prem = parseFloat(premium);

  const pl = price > strike
      ? ((price - strike) * 100) - (prem * 100)
      : -prem * 100;

  return pl.toFixed(2);
};

const App = () => {
  const [symbol, setSymbol] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [stockPrice, setStockPrice] = useState('');
  const [strikePrice, setStrikePrice] = useState('');
  const [premium, setPremium] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState({ show: false, correct: false, message: '' });

  const fetchStockData = async () => {
    setLoading(true);
    try {
      console.log(`Fetching data for ${symbol} on ${selectedDate}`);
      const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );

      const data = await response.json();
      console.log('API Response:', data);

      if (data.c) {  // Current price exists
        const currentPrice = data.c;
        setStockPrice(currentPrice.toFixed(2));
        // Set a reasonable strike price slightly above current price
        setStrikePrice((currentPrice * 1.05).toFixed(2));
        // Set a sample premium (this would normally come from options data)
        setPremium((currentPrice * 0.03).toFixed(2));
        return true;
      } else {
        setFeedback({
          show: true,
          correct: false,
          message: 'No data available for this date'
        });
        return false;
      }
    } catch (error) {
      setFeedback({
        show: true,
        correct: false,
        message: 'Error fetching stock data'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateQuestion = async () => {
    if (!symbol || !selectedDate) {
      setFeedback({
        show: true,
        correct: false,
        message: 'Please enter both symbol and date'
      });
      return;
    }

    const success = await fetchStockData();

    if (success) {
      setFeedback({
        show: true,
        correct: true,
        message: `Question: If you buy a call option for ${symbol} on ${selectedDate} with:
        Stock Price: $${stockPrice}
        Strike Price: $${strikePrice}
        Premium: $${premium}
        
        What's your break-even point?`
      });
    }
  };

  const checkAnswer = () => {
    const correctAnswer = parseFloat(strikePrice) + parseFloat(premium);
    const userGuess = parseFloat(userAnswer);

    if (Math.abs(userGuess - correctAnswer) < 0.01) {
      setFeedback({
        show: true,
        correct: true,
        message: `Correct! The break-even point is $${correctAnswer.toFixed(2)}. 
        Strike Price ($${strikePrice}) + Premium ($${premium}) = $${correctAnswer.toFixed(2)}`
      });
    } else {
      setFeedback({
        show: true,
        correct: false,
        message: `Try again! Hint: Add the strike price and premium together.`
      });
    }
  };

  return (
      <div className="min-h-screen bg-blue-50 p-8">
        <Card className="max-w-4xl mx-auto bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900">
              Options Trading Guide
            </CardTitle>
            <CardDescription>
              Learn options trading with interactive examples
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Concept Quiz Section */}
            <div className="border-b pb-8">
              <ConceptQuiz
                  stockPrice={stockPrice}
                  strikePrice={strikePrice}
                  premium={premium}
                  symbol={symbol}
              />
            </div>

            {/* Practical Calculator Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Practical Exercise</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left column: Chart and Analysis */}
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Sample P/L Analysis</h4>
                    {stockPrice && strikePrice && premium ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="font-medium">Maximum Loss:</span>
                              <p className="text-red-600">${(parseFloat(premium) * 100).toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="font-medium">Break-even Price:</span>
                              <p>${(parseFloat(strikePrice) + parseFloat(premium)).toFixed(2)}</p>
                            </div>
                          </div>

                          <ProfitLossChart
                              strikePrice={parseFloat(strikePrice)}
                              premium={parseFloat(premium)}
                              currentPrice={parseFloat(stockPrice)}
                          />

                          <div className="mt-4">
                            <h4 className="font-medium mb-2">P/L at different stock prices:</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {generatePriceLevels(stockPrice).map(price => (
                                  <div key={price} className="bg-white p-2 rounded">
                                    <div className="text-sm">At ${price}</div>
                                    <div className={calculatePL(price, strikePrice, premium) >= 0 ? "text-green-600" : "text-red-600"}>
                                      ${calculatePL(price, strikePrice, premium)}
                                    </div>
                                  </div>
                              ))}
                            </div>
                          </div>
                        </>
                    ) : (
                        <p className="text-gray-500">Enter stock details to see analysis</p>
                    )}
                  </div>
                </div>

                {/* Right column: Inputs and Question */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Stock Symbol</Label>
                    <Input
                        id="symbol"
                        placeholder="e.g., AAPL"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        className="bg-blue-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Select Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-blue-50"
                        max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <Button
                      onClick={generateQuestion}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={loading}
                  >
                    {loading ? (
                        <span className="flex items-center">
                      <Loader className="animate-spin mr-2" />
                      Loading...
                    </span>
                    ) : (
                        'Generate Question'
                    )}
                  </Button>

                  {feedback.show && (
                      <Alert className={feedback.correct ? "bg-green-50" : "bg-red-50"}>
                        <AlertCircle className={feedback.correct ? "text-green-600" : "text-red-600"} />
                        <AlertTitle className={feedback.correct ? "text-green-800" : "text-red-800"}>
                          {feedback.correct ? "Question Generated" : "Error"}
                        </AlertTitle>
                        <AlertDescription className="whitespace-pre-line">
                          {feedback.message}
                        </AlertDescription>
                      </Alert>
                  )}

                  {feedback.show && feedback.correct && (
                      <div className="space-y-2">
                        <Label htmlFor="answer">Your Answer ($)</Label>
                        <Input
                            id="answer"
                            type="number"
                            step="0.01"
                            placeholder="Enter your answer"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="bg-blue-50"
                        />
                        <Button
                            onClick={checkAnswer}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          Check Answer
                        </Button>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-blue-50 text-sm text-blue-800">
            Tip: Break-even point = Strike Price + Premium
          </CardFooter>
        </Card>
      </div>
  );
};

export default App;