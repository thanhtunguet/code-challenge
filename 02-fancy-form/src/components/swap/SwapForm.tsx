import { useState, useMemo, useCallback, useRef } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { PRICE_UPDATE_INTERVAL, useTokenPrices } from '@/hooks/useTokenPrices';
import { TokenWithIcon, SwapState } from '@/types/token';
import { SwapInput } from './SwapInput';
import { SwapButton } from './SwapButton';
import { ExchangeRate } from './ExchangeRate';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function SwapForm() {
  const { data: tokens, isLoading, error, refetch } = useTokenPrices();
  const { toast } = useToast();
  const [isSwapping, setIsSwapping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const refetchTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [swapState, setSwapState] = useState<SwapState>({
    fromToken: null,
    toToken: null,
    fromAmount: '',
    toAmount: '',
  });

  // Calculate exchange rate and output amount
  const { exchangeRate, toAmount, fromUsdValue, toUsdValue } = useMemo(() => {
    const { fromToken, toToken, fromAmount } = swapState;
    
    if (!fromToken || !toToken) {
      return { exchangeRate: '0', toAmount: '', fromUsdValue: '', toUsdValue: '' };
    }

    const rate = fromToken.price / toToken.price;
    const inputAmount = parseFloat(fromAmount) || 0;
    const outputAmount = inputAmount * rate;
    
    const fromUsd = (inputAmount * fromToken.price).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    const toUsd = (outputAmount * toToken.price).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return {
      exchangeRate: rate.toLocaleString(undefined, { maximumFractionDigits: 6 }),
      toAmount: inputAmount > 0 ? outputAmount.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '',
      fromUsdValue: fromUsd,
      toUsdValue: toUsd,
    };
  }, [swapState]);

  const handleFromAmountChange = useCallback((value: string) => {
    setSwapState((prev) => ({ ...prev, fromAmount: value }));
  }, []);

  const handleFromTokenSelect = useCallback((token: TokenWithIcon) => {
    setSwapState((prev) => ({ ...prev, fromToken: token }));
  }, []);

  const handleToTokenSelect = useCallback((token: TokenWithIcon) => {
    setSwapState((prev) => ({ ...prev, toToken: token }));
  }, []);

  const handleSwapTokens = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setSwapState((prev) => ({
        fromToken: prev.toToken,
        toToken: prev.fromToken,
        fromAmount: prev.toAmount ? prev.toAmount.replace(/,/g, '') : '',
        toAmount: '',
      }));
      setIsAnimating(false);
    }, 150);
  }, []);

  const handleInputBlur = useCallback(() => {
    // Clear any pending refetch
    if (refetchTimeoutRef.current) {
      clearTimeout(refetchTimeoutRef.current);
    }

    // Debounce refetch by 250ms
    refetchTimeoutRef.current = setTimeout(() => {
      refetch();
    }, 250);
  }, [refetch]);

  const handleSwap = async () => {
    if (!swapState.fromToken || !swapState.toToken || !swapState.fromAmount) {
      return;
    }

    setIsSwapping(true);
    
    // Simulate swap transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: 'Swap Successful!',
      description: `Swapped ${swapState.fromAmount} ${swapState.fromToken.currency} for ${toAmount} ${swapState.toToken.currency}`,
    });
    
    setSwapState((prev) => ({ ...prev, fromAmount: '', toAmount: '' }));
    setIsSwapping(false);
  };

  // Validation
  const validationError = useMemo(() => {
    if (!swapState.fromToken) return 'Select a token to swap from';
    if (!swapState.toToken) return 'Select a token to swap to';
    if (!swapState.fromAmount || parseFloat(swapState.fromAmount) === 0) return 'Enter an amount';
    if (parseFloat(swapState.fromAmount) < 0) return 'Amount must be positive';
    return null;
  }, [swapState]);

  if (error) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
        <p className="text-destructive">Failed to load token prices. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-3xl p-6 space-y-4 glow-effect">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Swap</h2>
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
            <Zap className="w-3 h-3 text-primary" />
            <span>Instant</span>
          </div>
        </div>

        {/* From Input */}
        <SwapInput
          label="From"
          amount={swapState.fromAmount}
          onAmountChange={handleFromAmountChange}
          selectedToken={swapState.fromToken}
          onTokenSelect={handleFromTokenSelect}
          tokens={tokens || []}
          otherToken={swapState.toToken}
          usdValue={fromUsdValue}
          onBlur={handleInputBlur}
        />

        {/* Swap Button */}
        <SwapButton onClick={handleSwapTokens} isAnimating={isAnimating} />

        {/* To Input */}
        <SwapInput
          label="To"
          amount={toAmount}
          onAmountChange={() => {}}
          selectedToken={swapState.toToken}
          onTokenSelect={handleToTokenSelect}
          tokens={tokens || []}
          otherToken={swapState.fromToken}
          isOutput
          usdValue={toUsdValue}
        />

        {/* Exchange Rate */}
        <ExchangeRate
          fromToken={swapState.fromToken}
          toToken={swapState.toToken}
          rate={exchangeRate}
          isLoading={isLoading}
        />

        {/* Swap Action Button */}
        <Button
          onClick={handleSwap}
          disabled={!!validationError || isSwapping || isLoading}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-primary-foreground rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSwapping ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Swapping...
            </>
          ) : isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            validationError || 'Swap'
          )}
        </Button>
      </div>

      {/* Info Footer */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Prices update every {PRICE_UPDATE_INTERVAL / 1000} seconds • Powered by Switcheo
      </p>
    </div>
  );
}
