// src/components/StrategySelector.jsx
import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';

import { STRATEGY_TYPES, STRATEGY_LABELS, STRATEGY_DESCRIPTIONS } from '../strategies/types';

const StrategySelector = ({ selectedStrategy, onStrategyChange }) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-2">
                <Select value={selectedStrategy} onValueChange={onStrategyChange}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(STRATEGY_TYPES).map((strategyType) => (
                            <SelectItem key={strategyType} value={strategyType}>
                                {STRATEGY_LABELS[strategyType]}
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
        </div>
    );
};

export default StrategySelector;