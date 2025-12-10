import React, { useMemo } from 'react';
import { useWalletBalances } from './hooks/useWalletBalances';
import type { WalletBalance } from './hooks/useWalletBalances';
import { usePrices } from './hooks/usePrices';
import { WalletRow } from './components/WalletRow';
import type { BoxProps } from './components/BoxProps';
import { TokenName } from './constants/TokenName';

interface WalletPageProps extends BoxProps {}

const getPriority = (blockchain: TokenName): number => {
    switch (blockchain) {
        case TokenName.Osmosis:
            return 100;
        case TokenName.Ethereum:
            return 50;
        case TokenName.Arbitrum:
            return 30;
        case TokenName.Zilliqa:
            return 20;
        case TokenName.Neo:
            return 20;
        default:
            return -99;
    }
};

const WalletPage: React.FC<WalletPageProps> = (props: WalletPageProps) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() => {
        // Calculate priorities once and store with balances
        const balancesWithPriority = balances.map(balance => ({
            balance,
            priority: getPriority(balance.blockchain)
        }));

        // Filter balances
        const filtered = balancesWithPriority.filter(({ balance, priority }) => {
            return (priority > -99) && (balance.amount >= 0);
        });

        // Sort by priority (descending)
        filtered.sort((lhs, rhs) => {
            if (lhs.priority > rhs.priority) {
                return -1;
            }
            if (rhs.priority > lhs.priority) {
                return 1;
            }
            return 0;
        });

        // Return only the balance objects
        return filtered.map(({ balance }) => balance);
    }, [balances]);

    const rows = useMemo(() => {
        return sortedBalances.map((balance: WalletBalance) => {
            const usdValue = prices[balance.currency] * balance.amount;
            const formattedAmount = balance.amount.toFixed(2);
            return (
                <WalletRow
                    key={balance.currency}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={formattedAmount}
                />
            );
        });
    }, [sortedBalances, prices]);

    return (
        <div {...rest}>
            {rows}
        </div>
    );
};

export default WalletPage;
