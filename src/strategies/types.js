// src/strategies/types.js

export const STRATEGY_TYPES = {
    LONG_CALL: 'LONG_CALL',
    COVERED_CALL: 'COVERED_CALL',
    CASH_SECURED_PUT: 'CASH_SECURED_PUT',
    COLLAR_STRATEGY: 'COLLAR_STRATEGY',
    OPTIONS_THEORY: 'OPTIONS_THEORY',
    PROTECTIVE_PUT: 'PROTECTIVE_PUT',
    LONG_PUT: 'LONG_PUT',
    LONG_CALL_SPREAD: 'LONG_CALL_SPREAD',
    LONG_PUT_SPREAD: 'LONG_PUT_SPREAD',
    FIG_LEAF: 'FIG_LEAF'
};

export const STRATEGY_LABELS = {
    [STRATEGY_TYPES.LONG_CALL]: 'Long Call',
    [STRATEGY_TYPES.COVERED_CALL]: 'Covered Call',
    [STRATEGY_TYPES.CASH_SECURED_PUT]: 'Cash Secured Put',
    [STRATEGY_TYPES.COLLAR_STRATEGY]: 'Collar Strategy',
    [STRATEGY_TYPES.OPTIONS_THEORY]: 'Options Theory',
    [STRATEGY_TYPES.PROTECTIVE_PUT]: 'Protective Put',
    [STRATEGY_TYPES.LONG_PUT]: 'Long Put',
    [STRATEGY_TYPES.LONG_CALL_SPREAD]: 'Long Call Spread',
    [STRATEGY_TYPES.LONG_PUT_SPREAD]: 'Long Put Spread',
    [STRATEGY_TYPES.FIG_LEAF]: 'Fig Leaf',
};

export const STRATEGY_DESCRIPTIONS = {
    [STRATEGY_TYPES.LONG_CALL]: 'Learn how to profit from stock price increases with limited risk using long call options.',
    [STRATEGY_TYPES.COVERED_CALL]: 'Learn how to generate income by selling call options against stock you own.',
    [STRATEGY_TYPES.CASH_SECURED_PUT]: 'Selling the Cash Secured Put obligates you to buy stock at strike price if the option is assigned.',
    [STRATEGY_TYPES.COLLAR_STRATEGY]: 'Protect stock positions while generating income through a combined put and call strategy.',
    [STRATEGY_TYPES.OPTIONS_THEORY]: 'Learn Stock Options',
    [STRATEGY_TYPES.PROTECTIVE_PUT]: 'Purchasing a protective put gives you the right to sell stock you already own at strike price.',
    [STRATEGY_TYPES.LONG_PUT]: 'Purchasing a put option, typically in anticipation of a decline in the underlying asset.',
    [STRATEGY_TYPES.LONG_CALL_SPREAD]: 'Bullish strategy: Buy lower-strike call, sell higher-strike call. Limited risk and reward, cheaper than buying calls.',
    [STRATEGY_TYPES.LONG_PUT_SPREAD]: 'A bearish options strategy that buys a put and sells a lower-strike put to reduce cost but caps profit',
    [STRATEGY_TYPES.FIG_LEAF]: 'Fig Leaf strategy buys a deep ITM LEAPS call while selling short-term OTM calls against it, creating a leveraged covered call.'
};