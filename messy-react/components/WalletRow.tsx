import React from 'react';
import { Box, Typography } from '@mui/material';

interface WalletRowProps {
    className?: string;
    amount: number;
    usdValue: number;
    formattedAmount: string;
}

/**
 * Component that displays a single wallet row with balance information
 */
export const WalletRow: React.FC<WalletRowProps> = ({
    className,
    amount,
    usdValue,
    formattedAmount
}) => {
    return (
        <Box className={className} sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 2,
            marginBottom: 1,
            border: '1px solid #e0e0e0',
            borderRadius: 1
        }}>
            <Box>
                <Typography variant="body1" fontWeight="bold">
                    {formattedAmount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Amount: {amount}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" color="primary">
                    ${usdValue.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    USD Value
                </Typography>
            </Box>
        </Box>
    );
};
