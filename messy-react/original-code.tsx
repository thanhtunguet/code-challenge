import { useMemo } from 'react';
import { useWalletBalances } from './hooks/useWalletBalances';
import { usePrices } from './hooks/usePrices';
import { WalletRow } from './components/WalletRow';
import type { BoxProps } from './components/BoxProps';
import { TokenName } from './constants/TokenName';

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: TokenName;
}

interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface WalletPageProps extends BoxProps {
    // Just an empty interface to satisfy the BoxProps interface
}

const WalletPage: React.FC<WalletPageProps> = (props: WalletPageProps) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const getPriority = (blockchain: TokenName): number => {
        switch (blockchain) {
            case TokenName.Osmosis:
                return 100
            case TokenName.Ethereum:
                return 50
            case TokenName.Arbitrum:
                return 30
            case TokenName.Zilliqa:
                return 20
            case TokenName.Neo:
                return 20
            default:
                return -99
        }
    }

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            return (balancePriority > -99) && (balance.amount >= 0);
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } 
            if (rightPriority > leftPriority) {
                return 1;
            }
            return 0;
        });
    }, [balances, prices]);

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row}
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })

    return (
        <div {...rest}>
            {rows}
        </div>
    );
}