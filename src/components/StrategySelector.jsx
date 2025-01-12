// src/components/StrategySelector.jsx
import React from 'react';
import { usePayment } from '../contexts/PaymentContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { STRATEGY_TYPES, STRATEGY_LABELS, STRATEGY_DESCRIPTIONS } from '../strategies/types';

const StrategySelector = ({ selectedStrategy, onStrategyChange }) => {
    const { isPremium } = usePayment();

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-2">
                <Select
                    value={selectedStrategy}
                    onValueChange={(value) => onStrategyChange(value)}
                >
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* Free Strategies */}
                        <SelectItem value={STRATEGY_TYPES.OPTIONS_THEORY}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.OPTIONS_THEORY]}
                        </SelectItem>
                        <SelectItem value={STRATEGY_TYPES.COVERED_CALL}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.COVERED_CALL]}
                        </SelectItem>

                        {/* Premium Strategies */}
                        <SelectItem value={STRATEGY_TYPES.CASH_SECURED_PUT}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.CASH_SECURED_PUT]} {!isPremium && '(Premium)'}
                        </SelectItem>
                        <SelectItem value={STRATEGY_TYPES.PROTECTIVE_PUT}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.PROTECTIVE_PUT]} {!isPremium && '(Premium)'}
                        </SelectItem>
                        <SelectItem value={STRATEGY_TYPES.LONG_CALL}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.LONG_CALL]} {!isPremium && '(Premium)'}
                        </SelectItem>
                        <SelectItem value={STRATEGY_TYPES.LONG_PUT}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.LONG_PUT]} {!isPremium && '(Premium)'}
                        </SelectItem>
                        <SelectItem value={STRATEGY_TYPES.COLLAR_STRATEGY}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.COLLAR_STRATEGY]} {!isPremium && '(Premium)'}
                        </SelectItem>
                        <SelectItem value={STRATEGY_TYPES.LONG_CALL_SPREAD}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.LONG_CALL_SPREAD]} {!isPremium && '(Premium)'}
                        </SelectItem>
                        <SelectItem value={STRATEGY_TYPES.LONG_PUT_SPREAD}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.LONG_PUT_SPREAD]} {!isPremium && '(Premium)'}
                        </SelectItem>
                        <SelectItem value={STRATEGY_TYPES.FIG_LEAF}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.FIG_LEAF]} {!isPremium && '(Premium)'}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {selectedStrategy && (
                <p className="text-sm text-gray-600">
                    {STRATEGY_DESCRIPTIONS[selectedStrategy]}
                </p>
            )}
        </div>
    );
};

export default StrategySelector;
