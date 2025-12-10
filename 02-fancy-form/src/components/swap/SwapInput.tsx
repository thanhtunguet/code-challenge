import { TokenWithIcon } from '@/types/token';
import { TokenSelector } from './TokenSelector';

interface SwapInputProps {
  label: string;
  amount: string;
  onAmountChange: (value: string) => void;
  selectedToken: TokenWithIcon | null;
  onTokenSelect: (token: TokenWithIcon) => void;
  tokens: TokenWithIcon[];
  otherToken?: TokenWithIcon | null;
  isOutput?: boolean;
  usdValue?: string;
  onBlur?: () => void;
}

export function SwapInput({
  label,
  amount,
  onAmountChange,
  selectedToken,
  onTokenSelect,
  tokens,
  otherToken,
  isOutput = false,
  usdValue,
  onBlur,
}: SwapInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only valid number inputs
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {selectedToken && (
          <span className="text-xs text-muted-foreground">
            Balance: <span className="text-foreground font-medium">0.00</span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={handleChange}
          onBlur={onBlur}
          readOnly={isOutput}
          className={`swap-input ${isOutput ? 'text-muted-foreground' : ''}`}
        />
        <TokenSelector
          selectedToken={selectedToken}
          tokens={tokens}
          onSelect={onTokenSelect}
          otherToken={otherToken}
          label={label}
        />
      </div>
      {usdValue && amount && parseFloat(amount) > 0 && (
        <p className="text-sm text-muted-foreground">
          ≈ ${usdValue}
        </p>
      )}
    </div>
  );
}
