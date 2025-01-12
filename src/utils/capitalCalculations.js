// src/utils/capitalCalculations.js
import { STRATEGY_TYPES } from '../strategies/types';

// Constants for Fig Leaf strategy calculations
const FIG_LEAF_CONSTANTS = {
    LEAPS_ITM_PERCENTAGE: 0.20,    // LEAPS strike is 20% ITM
    LEAPS_PREMIUM_MULTIPLIER: 3,    // LEAPS premium is typically 3x the short-term premium
};


export const calculateRequiredCapital = (strategy, stockPrice, strikePrice, premium) => {
    const price = parseFloat(stockPrice);
    const strike = parseFloat(strikePrice);
    const prem = parseFloat(premium);

    // For long call spread, calculate long and short premiums
    const longCallSpreadLongPremium = prem * 1.2;  // Higher premium for lower strike
    const longCallSpreadshortPremium = prem * 0.8;  // Lower premium for higher strike
    const longCallSpreadNetDebit= longCallSpreadLongPremium - longCallSpreadshortPremium;

    // For long put spread, calculate long and short premiums
    const longPutSpreadLongPremium = prem;         // Premium paid for higher strike put
    const longPutSpreadShortPremium = prem * 0.7;  // Premium received for lower strike put
    const longPutSpreadNetDebit = longPutSpreadLongPremium - longPutSpreadShortPremium;

    // Calculate LEAPS strike (20% ITM) and premium
    const leapsStrike = price * (1 - FIG_LEAF_CONSTANTS.LEAPS_ITM_PERCENTAGE);
    const leapsPremium = prem * FIG_LEAF_CONSTANTS.LEAPS_PREMIUM_MULTIPLIER;
    const figLeafNetDebit = leapsPremium - prem; // LEAPS premium - short call premium

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
        case STRATEGY_TYPES.LONG_PUT_SPREAD:
            return {
                amount: (longPutSpreadNetDebit * 100).toFixed(2),
                description: '(net debit for long put spread)'
            };
        case STRATEGY_TYPES.FIG_LEAF:

            return {
                amount: (figLeafNetDebit * 100).toFixed(2),
                description: '(net debit for LEAPS + short call)'
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

    // For long put spread, calculate long and short premiums
    const longPutSpreadLongPremium = prem;         // Premium paid for higher strike put
    const longPutSpreadShortPremium = prem * 0.7;  // Premium received for lower strike put
    const longPutSpreadNetDebit = longPutSpreadLongPremium - longPutSpreadShortPremium;

    // Calculate LEAPS premium and net debit
    const figLeafLeapsPremium = prem * FIG_LEAF_CONSTANTS.LEAPS_PREMIUM_MULTIPLIER;
    const figLeafInitialDebit = figLeafLeapsPremium - prem;

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
        case STRATEGY_TYPES.LONG_PUT_SPREAD:
            return {
                amount: (longPutSpreadNetDebit * 100).toFixed(2),
                description: 'net debit paid'
            };
        case STRATEGY_TYPES.FIG_LEAF:
            // Calculate LEAPS premium and net debit
            return {
                amount: (figLeafInitialDebit * 100).toFixed(2),
                description: 'net debit paid (LEAPS premium - short call premium)'
            };
        default:
            return {
                amount: '0.00',
                description: ''
            };
    }
};