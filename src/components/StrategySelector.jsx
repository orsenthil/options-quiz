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
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import {STRATEGY_DESCRIPTIONS, STRATEGY_LABELS, STRATEGY_TYPES} from "@/strategies/types.js";

const PREMIUM_STRATEGIES = [
    STRATEGY_TYPES.LONG_CALL,
    STRATEGY_TYPES.CASH_SECURED_PUT,
    STRATEGY_TYPES.PROTECTIVE_PUT,
    STRATEGY_TYPES.COLLAR_STRATEGY
];

const StrategySelector = ({ selectedStrategy, onStrategyChange }) => {
    const { isPremium } = usePayment();

    const handleStrategyChange = (value) => {
        if (PREMIUM_STRATEGIES.includes(value) && !isPremium) {
            return;
        }
        onStrategyChange(value);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-2">
                <Select value={selectedStrategy} onValueChange={handleStrategyChange}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={STRATEGY_TYPES.OPTIONS_THEORY}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.OPTIONS_THEORY]}
                        </SelectItem>
                        <SelectItem value={STRATEGY_TYPES.COVERED_CALL}>
                            {STRATEGY_LABELS[STRATEGY_TYPES.COVERED_CALL]}
                        </SelectItem>
                        {Object.values(STRATEGY_TYPES)
                            .filter(type =>
                                type !== STRATEGY_TYPES.OPTIONS_THEORY &&
                                type !== STRATEGY_TYPES.COVERED_CALL
                            )
                            .map((strategyType) => (
                                <SelectItem
                                    key={strategyType}
                                    value={strategyType}
                                    disabled={!isPremium}
                                >
                                    {STRATEGY_LABELS[strategyType]} {!isPremium && '(Premium)'}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
            {selectedStrategy && (
                <p className="text-sm text-gray-600">
                    {STRATEGY_DESCRIPTIONS[selectedStrategy]}
                </p>
            )}
            {!isPremium && (
                <Alert className="bg-blue-50">
                    <AlertCircle className="text-blue-600" />
                    <AlertDescription>
                        Upgrade to premium to access advanced options strategies
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};
export default StrategySelector;