import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { useAuth } from './contexts/AuthContext';
import { usePayment } from './contexts/PaymentContext';
import AuthGuard from './components/AuthGuard';
import StrategySelector from './components/StrategySelector';
import { STRATEGY_TYPES } from './strategies/types';
import Login from './components/Login';
import ScoreHistory from './components/ScoreHistory';
import PaymentGateway from './components/PaymentGateway';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { AlertCircle, Loader } from "lucide-react";
import ConceptQuiz from './components/ConceptQuiz';
import ProfitLossChart from './components/ProfitLossChart';
import { SP500_SYMBOLS } from './sp500list';

import { Routes, Route } from 'react-router-dom';
import SuccessPage from './components/SuccessPage';
import CompanyDetails from './components/CompanyDetails';
import {calculateRequiredCapital, calculateInitialInvestment} from "./utils/capitalCalculations.js";
import TradingViewChart from "./components/TradingViewChart.jsx";

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

const AppContent = () => {
  const { user } = useAuth();
  const { isPremium } = usePayment();
  const getRandomSymbol = () => {
    const randomIndex = Math.floor(Math.random() * SP500_SYMBOLS.length);
    return SP500_SYMBOLS[randomIndex];
  };
  const [selectedStrategy, setSelectedStrategy] = useState(STRATEGY_TYPES.OPTIONS_THEORY);
  const [symbol, setSymbol] = useState(() => getRandomSymbol());
  const [loading, setLoading] = useState(false);
  const [stockPrice, setStockPrice] = useState('');
  const [strikePrice, setStrikePrice] = useState('');
  const [premium, setPremium] = useState('');
  const [feedback, setFeedback] = useState({ show: false, correct: false, message: '' });

  const [expirationDate, setExpirationDate] = useState('');
  const [futurePrice, setFuturePrice] = useState('');
  const [companyDetails, setCompanyDetails] = useState(null);
  const [companyName, setCompanyName] = useState('');

  const fetchCompanyDetails = async (stockSymbol) => {
    try {
      const response = await fetch(
          `https://finnhub.io/api/v1/stock/profile2?symbol=${stockSymbol}&token=${FINNHUB_API_KEY}`
      );
      const data = await response.json();
      if (data) {
        setCompanyDetails(data);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const isPremiumStrategy = (strategy) => {
    return ![STRATEGY_TYPES.OPTIONS_THEORY, STRATEGY_TYPES.COVERED_CALL].includes(strategy);
  };

  // Modify the strategy change handler

  const handleStrategyChange = (strategy) => {
    if (isPremiumStrategy(strategy) && !isPremium) {
      return;
    }
    setSelectedStrategy(strategy);
    // Reset other states as needed
    setSymbol('');
    setStockPrice('');
    setStrikePrice('');
    setPremium('');
  };


  const addBusinessDays = (date, days) => {
    let currentDate = new Date(date);
    let addedDays = 0;
    while (addedDays < days) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        addedDays++;
      }
    }
    return currentDate;
  };

  // Modify the strike price calculation based on strategy
  const calculateStrikePrice = (currentPrice, strategy) => {
    switch (strategy) {
      case STRATEGY_TYPES.LONG_CALL:
        return currentPrice * 1.05; // 5% OTM (above current price)
      case STRATEGY_TYPES.COVERED_CALL:
        return currentPrice * 1.08; // 8% OTM (above current price)
      case STRATEGY_TYPES.CASH_SECURED_PUT:
        return currentPrice * 0.92; // 8% OTM (below current price)
      case STRATEGY_TYPES.PROTECTIVE_PUT:
        return currentPrice * 0.90; // 10% OTM (below current price)
      case STRATEGY_TYPES.COLLAR_STRATEGY:
        return currentPrice * 1.10; // 10% OTM for the call side
      default:
        return currentPrice * 1.10;
    }
  };

  const calculatePremiumMultiplier = (strategy) => {
    switch (strategy) {
      case STRATEGY_TYPES.COVERED_CALL:
        return 0.004; // 0.4% of stock price
      case STRATEGY_TYPES.LONG_CALL:
        return 0.015; // 1.5% of stock price
      case STRATEGY_TYPES.CASH_SECURED_PUT:
        return 0.008; // 0.8% of stock price (typically less than calls due to put-call skew)
      case STRATEGY_TYPES.PROTECTIVE_PUT:
        return 0.012; // 1.2% of stock price
      case STRATEGY_TYPES.COLLAR_STRATEGY:
        return 0.006; // 0.6% of stock price (net premium after both options)
      default:
        return 0.01; // 1% default
    }
  };

  const fetchStockData = async () => {
    setLoading(true);
    try {
      console.log('Starting fetchStockData with:', { symbol });
      // Fetch company details first
      await fetchCompanyDetails(symbol);

      // Calculate expiration date (10 business days from today )
      const expirationDate = addBusinessDays(new Date(), 10);

      // Fetch current price using quote endpoint
      const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      const data = await response.json();
      console.log('Quote data:', data);

      if (data.c) {
        // Get current price
        const startingPrice = data.c;

        // Calculate random price movement between -5% to +15%
        const minChange = -0.05;
        const maxChange = 0.15;
        const randomChange = Math.random() * (maxChange - minChange) + minChange;
        const futurePrice = startingPrice * (1 + randomChange);

        console.log('Setting data with values:', {
          startingPrice,
          randomChange: `${(randomChange * 100).toFixed(2)}%`,
          futurePrice
        });

        // Set initial price and calculated values
        setStockPrice(startingPrice.toFixed(2));
        const strike = calculateStrikePrice(startingPrice, selectedStrategy);
        setStrikePrice(strike.toFixed(2));
        const premiumMultiplier = calculatePremiumMultiplier(selectedStrategy);
        setPremium((startingPrice * premiumMultiplier).toFixed(2));

        // Set future (expiration) price with random movement
        setFuturePrice(futurePrice.toFixed(2));

        // Set expiration date
        setExpirationDate(expirationDate.toISOString().split('T')[0]);

        console.log('Data set successfully:', {
          stockPrice: startingPrice.toFixed(2),
          strikePrice: (startingPrice * 1.05).toFixed(2),
          premium: (startingPrice * 0.03).toFixed(2),
          futurePrice: futurePrice.toFixed(2),
          expirationDate: expirationDate.toISOString().split('T')[0],
        });

        return true;
      } else {
        console.log('Missing required data:', {
          hasCurrentPrice: Boolean(data.c)
        });

        setFeedback({
          show: true,
          correct: false,
          message: 'No data available for this symbol'
        });
        return false;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
    if (!symbol) {
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

  const renderContent = () => {
    // First check if it's a premium strategy and user doesn't have premium
    if (isPremiumStrategy(selectedStrategy) && !isPremium) {
      return (
          <div className="mt-8">
            <PaymentGateway />
          </div>
      );
    }

    // If we're here, either it's a free strategy or user has premium
    // Now we can check for quiz prerequisites
    const showQuiz = stockPrice &&
        strikePrice &&
        premium &&
        futurePrice &&
        expirationDate;

    return (
        <div className="space-y-8">
          {/* Quiz Section */}
          {showQuiz && (
              <div className="border-t pt-8">
                <ConceptQuiz
                    stockPrice={stockPrice}
                    strikePrice={strikePrice}
                    premium={premium}
                    symbol={symbol}
                    expirationDate={expirationDate}
                    futurePrice={futurePrice}
                    selectedDate={new Date().toISOString().split('T')[0]}
                    strategy={selectedStrategy}
                />
              </div>
          )}
        </div>
    );
  };

  return (
          <div className="min-h-screen bg-blue-50 p-8">
            <Card className="max-w-4xl mx-auto bg-white mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold text-blue-900">
                      Options Trading Guide
                    </CardTitle>
                    <CardDescription>
                      Learn options trading concepts with interactive examples
                    </CardDescription>
                  </div>
                  <Login />
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <StrategySelector
                    selectedStrategy={selectedStrategy}
                    onStrategyChange={setSelectedStrategy}
                />

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
                              placeholder={`Enter symbol (e.g., ${getRandomSymbol()})`}
                              value={symbol}
                              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                              className="bg-blue-50"
                          />
                        </div>

                        <Button
                            onClick={generateQuestion}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                          {loading ? (
                              <span className="flex items-center">
                  <Loader className="animate-spin mr-2"/>
                  Loading...
                </span>
                          ) : (
                              'Analyze Stock'
                          )}
                        </Button>

                        {/* Company and Option Details */}
                        {stockPrice && strikePrice && premium && (!isPremiumStrategy(selectedStrategy) || isPremium) ? (
                            <CompanyDetails
                                stockPrice={stockPrice}
                                strikePrice={strikePrice}
                                premium={premium}
                                companyDetails={companyDetails}
                            />
                        ) : null}

                        {feedback.show && !feedback.correct && (
                            <Alert className="bg-red-50">
                              <AlertCircle className="text-red-600"/>
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

                          <h4 className="font-medium mb-2">Analysis</h4>
                          {stockPrice && strikePrice && (!isPremiumStrategy(selectedStrategy) || isPremium) ? (
                              <>
                                {/*
                                <ProfitLossChart
                                    strikePrice={parseFloat(strikePrice)}
                                    premium={parseFloat(premium)}
                                    currentPrice={parseFloat(stockPrice)}
                                    strategy={selectedStrategy}
                                />

                                <div className="mt-6">
                                  <h4 className="font-medium mb-2">P/L at different stock prices:</h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    {generatePriceLevels(stockPrice).map(price => (
                                        <div key={price} className="bg-white p-2 rounded">
                                          <div className="text-sm">At ${price}</div>
                                          <div
                                              className={calculatePL(price, strikePrice, premium) >= 0 ? "text-green-600" : "text-red-600"}>
                                            ${calculatePL(price, strikePrice, premium)}
                                          </div>
                                        </div>
                                    ))}
                                  </div>
                                </div>
                                */ }

                                {/* Option Details Card moved here */}
                                <TradingViewChart symbol={symbol}/>

                                <div className="mt-6">
                                  <Card className="bg-white">
                                    <CardContent className="pt-6">
                                      <h3 className="text-lg font-semibold mb-4">Options Details</h3>
                                      {selectedStrategy === STRATEGY_TYPES.COLLAR_STRATEGY ? (
                                          // Collar Strategy Details
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="text-sm text-gray-500">Current Stock Price</p>
                                              <p className="font-medium">${stockPrice}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Call Strike (Short)</p>
                                              <p className="font-medium">${strikePrice}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Put Strike (Long)</p>
                                              <p className="font-medium">${(parseFloat(stockPrice) * 0.9).toFixed(2)}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Call Premium (Received)</p>
                                              <p className="font-medium text-green-600">+${premium} per share</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Put Premium (Paid)</p>
                                              <p className="font-medium text-red-600">-${(parseFloat(premium) * 0.8).toFixed(2)} per
                                                share</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Net Debit/Credit</p>
                                              <p className={`font-medium ${parseFloat(premium) * 0.2 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ${(parseFloat(premium) * 0.2).toFixed(2)} per share
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Maximum Profit</p>
                                              <p className="font-medium">${((parseFloat(strikePrice) - parseFloat(stockPrice)) + parseFloat(premium) * 0.2).toFixed(2)} per
                                                share</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Maximum Loss</p>
                                              <p className="font-medium">${((parseFloat(stockPrice) - parseFloat(stockPrice) * 0.9) - parseFloat(premium) * 0.2).toFixed(2)} per
                                                share</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Required Collateral</p>
                                              <p className="font-medium">
                                                ${calculateRequiredCapital(selectedStrategy, stockPrice, strikePrice, premium).amount}
                                                <span className="text-sm text-gray-500 ml-1">
                                                {calculateRequiredCapital(selectedStrategy, stockPrice, strikePrice, premium).description}
                                              </span>
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Initial Cash Flow</p>
                                              <p className={`font-medium ${parseFloat(premium) * 0.2 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ${calculateInitialInvestment(selectedStrategy, stockPrice, strikePrice, premium).amount}
                                                <span className="text-sm text-gray-500 ml-1">
                                                {calculateInitialInvestment(selectedStrategy, stockPrice, strikePrice, premium).description}
                                              </span>
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Trade Date</p>
                                              <p className="font-medium">{new Date().toISOString().split('T')[0]}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Expiration Date</p>
                                              <p className="font-medium">${expirationDate}</p>
                                            </div>
                                          </div>
                                      ) : (
                                          // Standard Option Details for other strategies
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="text-sm text-gray-500">Current Stock Price</p>
                                              <p className="font-medium">${stockPrice}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Strike Price</p>
                                              <p className="font-medium">${strikePrice}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Option Premium</p>
                                              <p className="font-medium">${premium} per share</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Total Cost</p>
                                              <p className="font-medium">${(parseFloat(premium) * 100).toFixed(2)}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Required Collateral</p>
                                              <p className="font-medium">
                                                ${calculateRequiredCapital(selectedStrategy, stockPrice, strikePrice, premium).amount}
                                                <span className="text-sm text-gray-500 ml-1">
                                                {calculateRequiredCapital(selectedStrategy, stockPrice, strikePrice, premium).description}
                                              </span>
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Initial Cash Flow</p>
                                              <p className={`font-medium ${selectedStrategy === STRATEGY_TYPES.COVERED_CALL || selectedStrategy === STRATEGY_TYPES.CASH_SECURED_PUT ? 'text-green-600' : 'text-red-600'}`}>
                                                {selectedStrategy === STRATEGY_TYPES.COVERED_CALL || selectedStrategy === STRATEGY_TYPES.CASH_SECURED_PUT ? '+' : '-'}
                                                ${calculateInitialInvestment(selectedStrategy, stockPrice, strikePrice, premium).amount}
                                                <span className="text-sm text-gray-500 ml-1">
                                                {calculateInitialInvestment(selectedStrategy, stockPrice, strikePrice, premium).description}
                                              </span>
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Trade Date</p>
                                              <p className="font-medium">{new Date().toISOString().split('T')[0]}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Expiration Date</p>
                                              <p className="font-medium">${expirationDate}</p>
                                            </div>
                                          </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>

                              </>
                          ) : (
                              <p className="text-gray-500">Select a stock symbol and date to see analysis</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>


                {renderContent()}
                {/* Score history for logged-in users */}
                {/** {user && <ScoreHistory />} */}
              </CardContent>
            </Card>
          </div>
  );
};

const App = () => {
  return (
      <AuthProvider>
        <PaymentProvider>
          <Routes>
            <Route path="/" element={<AppContent/>}/>
            <Route path="/success" element={<SuccessPage/>}/>
          </Routes>
        </PaymentProvider>
      </AuthProvider>
  );
};

export default App;