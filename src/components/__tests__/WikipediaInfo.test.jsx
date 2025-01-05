// src/components/__tests__/WikipediaInfo.test.jsx
import React, { act } from 'react';  // Import act from 'react' instead
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WikipediaInfo from '../WikipediaInfo';

// Mock fetch globally
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            query: {
                search: [{
                    pageid: 12345,
                    title: "Apple Inc.",
                }]
            }
        })
    })
);

describe('WikipediaInfo Component', () => {
    it('renders company name', async () => {
        await act(async () => {
            render(<WikipediaInfo companyName="Apple Inc." />);
        });

        // Let's check if "Company Information" title is present
        expect(screen.getByText('Company Information')).toBeInTheDocument();
    });
});