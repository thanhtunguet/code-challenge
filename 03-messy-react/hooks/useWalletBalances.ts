import { useState, useEffect } from 'react';
import type { TokenName } from '../constants/TokenName';

export interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: TokenName;
}

/**
 * Mock hook that returns wallet balances
 * In a real implementation, this would fetch data from an API or blockchain
 */
export const useWalletBalances = (): WalletBalance[] => {
    const [balances, setBalances] = useState<WalletBalance[]>([]);

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockBalances: WalletBalance[] = [
            {
                currency: 'Osmosis',
                amount: 100.5,
                blockchain: 'Osmosis'
            },
            {
                currency: 'Ethereum',
                amount: 2.3,
                blockchain: 'Ethereum'
            },
            {
                currency: 'Arbitrum',
                amount: 0.0,
                blockchain: 'Arbitrum'
            },
            {
                currency: 'Zilliqa',
                amount: 50.75,
                blockchain: 'Zilliqa'
            },
            {
                currency: 'Neo',
                amount: 0.0,
                blockchain: 'Neo'
            },
            {
                currency: 'Polygon',
                amount: 10.2,
                blockchain: 'Polygon'
            }
        ];

        // Simulate async data fetching
        setTimeout(() => {
            setBalances(mockBalances);
        }, 100);
    }, []);

    return balances;
};
