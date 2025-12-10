import { RefreshCw } from 'lucide-react';
import { TokenWithIcon } from '@/types/token';

interface ExchangeRateProps {
  fromToken: TokenWithIcon | null;
  toToken: TokenWithIcon | null;
  rate: string;
  isLoading: boolean;
}

export function ExchangeRate({ fromToken, toToken, rate, isLoading }: ExchangeRateProps) {
  if (!fromToken || !toToken) return null;

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        <span>Exchange Rate</span>
      </div>
      <p className="text-sm font-medium">
        1 {fromToken.currency} ≈ {rate} {toToken.currency}
      </p>
    </div>
  );
}
