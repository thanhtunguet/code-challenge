import { useState, useEffect } from 'react';

/**
 * Mock hook that returns current prices for currencies
 * In a real implementation, this would fetch prices from a price API
 */
export const usePrices = (): Record<string, number> => {
    const [prices, setPrices] = useState<Record<string, number>>({});

    useEffect(() => {
        // Mock price data - replace with actual API call
        const mockPrices: Record<string, number> = {
            'Osmosis': 0.95,
            'Ethereum': 2500.00,
            'Arbitrum': 1.20,
            'Zilliqa': 0.05,
            'Neo': 12.50,
            'Polygon': 0.85,
            'USD': 1.00,
            'BTC': 45000.00
        };

        // Simulate async data fetching
        setTimeout(() => {
            setPrices(mockPrices);
        }, 100);
    }, []);

    return prices;
};
