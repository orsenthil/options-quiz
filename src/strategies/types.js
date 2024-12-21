// src/strategies/types.js

export const STRATEGY_TYPES = {
    LONG_CALL: 'LONG_CALL',
    COVERED_CALL: 'COVERED_CALL'
};

export const STRATEGY_LABELS = {
    [STRATEGY_TYPES.LONG_CALL]: 'Long Call',
    [STRATEGY_TYPES.COVERED_CALL]: 'Covered Call'
};

export const STRATEGY_DESCRIPTIONS = {
    [STRATEGY_TYPES.LONG_CALL]: 'Learn how to profit from stock price increases with limited risk using long call options.',
    [STRATEGY_TYPES.COVERED_CALL]: 'Learn how to generate income by selling call options against stock you own.'
};