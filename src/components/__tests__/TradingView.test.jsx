// src/components/__tests__/TradingView.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import TradingView from '../TradingView';

describe('TradingView', () => {
    it('renders nothing when no symbol is provided', () => {
        const { container } = render(<TradingView />);
        expect(container.firstChild).toBeNull();
    });

    it('renders correctly with a symbol', () => {
        render(<TradingView symbol="AAPL" />);

        // Check if the title is rendered
        expect(screen.getByText('Technical Analysis')).toBeInTheDocument();

        // Check if the link to TradingView is correct
        const link = screen.getByText('View on TradingView');
        expect(link.closest('a')).toHaveAttribute(
            'href',
            'https://www.tradingview.com/symbols/AAPL/'
        );

        // Check if symbol is mentioned in the description
        expect(screen.getByText(/AAPL/)).toBeInTheDocument();
    });

    it('has correct link attributes for security', () => {
        render(<TradingView symbol="AAPL" />);
        const link = screen.getByText('View on TradingView').closest('a');

        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
});