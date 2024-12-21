// src/strategies/types.js

export const STRATEGY_TYPES = {
    LONG_CALL: 'LONG_CALL',
    COVERED_CALL: 'COVERED_CALL',
    CASH_SECURED_PUT: 'CASH_SECURED_PUT',
    COLLAR_STRATEGY: 'COLLAR_STRATEGY',
    OPTIONS_THEORY: 'OPTIONS_THEORY',
    PROTECTIVE_PUT: 'PROTECTIVE_PUT'
};

export const STRATEGY_LABELS = {
    [STRATEGY_TYPES.LONG_CALL]: 'Long Call',
    [STRATEGY_TYPES.COVERED_CALL]: 'Covered Call',
    [STRATEGY_TYPES.CASH_SECURED_PUT]: 'Cash Secured Put',
    [STRATEGY_TYPES.COLLAR_STRATEGY]: 'Collar Strategy',
    [STRATEGY_TYPES.OPTIONS_THEORY]: 'Options Theory',
    [STRATEGY_TYPES.PROTECTIVE_PUT]: 'Protective Put',
};

export const STRATEGY_DESCRIPTIONS = {
    [STRATEGY_TYPES.LONG_CALL]: 'Learn how to profit from stock price increases with limited risk using long call options.',
    [STRATEGY_TYPES.COVERED_CALL]: 'Learn how to generate income by selling call options against stock you own.',
    [STRATEGY_TYPES.CASH_SECURED_PUT]: 'Selling the Cash Secured Put obligates you to buy stock at strike price if the option is assigned.',
    [STRATEGY_TYPES.COLLAR_STRATEGY]: 'Simultaneously running a protective put and a covered call.',
    [STRATEGY_TYPES.OPTIONS_THEORY]: 'Learn Stock Options',
    [STRATEGY_TYPES.PROTECTIVE_PUT]: 'Purchasing a protective put gives you the right to sell stock you already own at strike price.',

};