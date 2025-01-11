// src/utils/capitalCalculations.js
import { STRATEGY_TYPES } from '../strategies/types';

export const calculateRequiredCapital = (strategy, stockPrice, strikePrice, premium) => {
    const price = parseFloat(stockPrice);
    const strike = parseFloat(strikePrice);
    const prem = parseFloat(premium);

    // For long call spread, calculate long and short premiums
    const longCallSpreadLongPremium = prem * 1.2;  // Higher premium for lower strike
    const longCallSpreadshortPremium = prem * 0.8;  // Lower premium for higher strike
    const longCallSpreadNetDebit= longCallSpreadLongPremium - longCallSpreadshortPremium;

    switch (strategy) {
        case STRATEGY_TYPES.COVERED_CALL:
            return {
                amount: (price * 100).toFixed(2),
                description: '(100 shares)'
            };
        case STRATEGY_TYPES.CASH_SECURED_PUT:
            return {
                amount: (strike * 100).toFixed(2),
                description: '(cash to buy 100 shares)'
            };
        case STRATEGY_TYPES.LONG_CALL:
            return {
                amount: (prem * 100).toFixed(2),
                description: '(premium for 1 contract)'
            };
        case STRATEGY_TYPES.PROTECTIVE_PUT:
            return {
                amount: ((price * 100) + (prem * 100)).toFixed(2),
                description: '(100 shares + put premium)'
            };
        case STRATEGY_TYPES.COLLAR_STRATEGY:
            return {
                amount: (price * 100).toFixed(2),
                description: '(100 shares)'
            };
        case STRATEGY_TYPES.LONG_PUT:
            return {
                amount: (prem * 100).toFixed(2),
                description: '(premium for 1 contract)'
            };
        case STRATEGY_TYPES.LONG_CALL_SPREAD:
            return {
                amount: (longCallSpreadNetDebit * 100).toFixed(2),
                description: '(net debit for long call spread)'
            };
        default:
            return {
                amount: '0.00',
                description: ''
            };
    }
};

export const calculateInitialInvestment = (strategy, stockPrice, strikePrice, premium) => {
    const price = parseFloat(stockPrice);
    const strike = parseFloat(strikePrice);
    const prem = parseFloat(premium);
    const putPremium = prem * 0.8; // For collar strategy
    const longCallSpreadLongPremium = prem * 1.2;  // Higher premium for lower strike
    const longCallSpreadShortPremium = prem * 0.8;  // Lower premium for higher strike
    const longCallSpreadNetDebit = longCallSpreadLongPremium - longCallSpreadShortPremium;

    switch (strategy) {
        case STRATEGY_TYPES.COVERED_CALL:
            return {
                amount: (prem * 100).toFixed(2),
                description: 'premium received'
            };
        case STRATEGY_TYPES.CASH_SECURED_PUT:
            return {
                amount: (prem * 100).toFixed(2),
                description: 'premium received'
            };
        case STRATEGY_TYPES.LONG_CALL:
            return {
                amount: (prem * 100).toFixed(2),
                description: 'premium paid'
            };
        case STRATEGY_TYPES.PROTECTIVE_PUT:
            return {
                amount: (prem * 100).toFixed(2),
                description: 'premium paid'
            };
        case STRATEGY_TYPES.COLLAR_STRATEGY:
            const netDebit = putPremium - prem;
            return {
                amount: Math.abs(netDebit * 100).toFixed(2),
                description: netDebit > 0 ? 'net debit paid' : 'net credit received'
            };
        case STRATEGY_TYPES.LONG_PUT:
            return {
                amount: (prem * 100).toFixed(2),
                description: 'premium paid'
            };
        case STRATEGY_TYPES.LONG_CALL_SPREAD:
            return {
                amount: (longCallSpreadNetDebit * 100).toFixed(2),
                description: 'net debit paid'
            };
        default:
            return {
                amount: '0.00',
                description: ''
            };
    }
};