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
        message: ''
      });
    }
  };

  return (
      <div className="min-h-screen bg-blue-50 p-8">
        <Card className="max-w-4xl mx-auto bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900">
              Long Call Options Trading Guide
            </CardTitle>
            <CardDescription>
              Learn long call options trading concepts with interactive examples
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Stock Selection and P/L Analysis */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Options Analysis Tool</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left column: Stock Selection */}
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
                        'Analyze Stock'
                    )}
                  </Button>

                  {/* New Information Section */}
                  {stockPrice && strikePrice && premium && (
                      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-medium text-blue-900">Option Details:</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <span className="text-sm text-gray-600">Stock Price:</span>
                            <p className="font-medium">${stockPrice}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Strike Price:</span>
                            <p className="font-medium">${strikePrice}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Option Premium:</span>
                            <p className="font-medium">${premium} per share</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Total Cost:</span>
                            <p className="font-medium">${(parseFloat(premium) * 100).toFixed(2)}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm text-gray-600">Expiration Date:</span>
                            <p className="font-medium">{selectedDate}</p>
                          </div>
                        </div>
                      </div>
                  )}

                  {feedback.show && !feedback.correct && (
                      <Alert className="bg-red-50">
                        <AlertCircle className="text-red-600" />
                        <AlertTitle className="text-red-800">Error</AlertTitle>
                        <AlertDescription className="whitespace-pre-line">
                          {feedback.message}
                        </AlertDescription>
                      </Alert>
                  )}

                </div>

                {/* Right column: P/L Analysis */}
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Profit/Loss Analysis</h4>
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
                        <p className="text-gray-500">Select a stock symbol and date to see analysis</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Practice Questions Section */}
            {stockPrice && strikePrice && premium && (
                <div className="border-t pt-8">
                  <ConceptQuiz
                      stockPrice={stockPrice}
                      strikePrice={strikePrice}
                      premium={premium}
                      symbol={symbol}
                  />
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default App;