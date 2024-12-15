import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { AlertCircle, Loader } from "lucide-react";

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

const OptionsQuiz = () => {
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
      // First get the current stock price
      console.log(`Fetching data for ${symbol} on ${selectedDate}`);
      const quoteResponse = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      
      const quoteData = await quoteResponse.json();
      console.log('Quote API Response:', quoteData);
      
      if (quoteData.c) {  // Current price exists
        const currentPrice = quoteData.c;
        setStockPrice(currentPrice.toFixed(2));
        
        // Now fetch options data
        const optionsResponse = await fetch(
          `https://finnhub.io/api/v1/stock/option-chain?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        
        const optionsData = await optionsResponse.json();
        console.log('Options API Response:', optionsData);
        
        if (optionsData.data && optionsData.data.length > 0) {
          // Find the first call option slightly above current price
          const callOptions = optionsData.data
            .filter(option => option.type === 'call')
            .sort((a, b) => a.strike - b.strike);
            
          const nearestCall = callOptions.find(option => option.strike > currentPrice);
          
          if (nearestCall) {
            setStrikePrice(nearestCall.strike.toFixed(2));
            setPremium(nearestCall.lastPrice.toFixed(2));
          } else {
            // Fallback to calculated values if no suitable option found
            setStrikePrice((currentPrice * 1.05).toFixed(2));
            setPremium((currentPrice * 0.03).toFixed(2));
          }
        } else {
          // Fallback to calculated values if no options data
          setStrikePrice((currentPrice * 1.05).toFixed(2));
          setPremium((currentPrice * 0.03).toFixed(2));
        }
        return true;
      } else {
        setFeedback({
          show: true,
          correct: false,
          message: 'No stock price data available'
        });
        return false;
      }
    } catch (error) {
      console.error('API Error:', error);
      setFeedback({
        show: true,
        correct: false,
        message: `Error fetching data: ${error.message}`
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
      <Card className="max-w-2xl mx-auto bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900">
            Long Call Options Quiz
          </CardTitle>
          <CardDescription>
            Practice calculating break-even points using real market data
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
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
        </CardContent>
        
        <CardFooter className="bg-blue-50 text-sm text-blue-800">
          Tip: Break-even point = Strike Price + Premium
        </CardFooter>
      </Card>
    </div>
  );
};

export default OptionsQuiz;
