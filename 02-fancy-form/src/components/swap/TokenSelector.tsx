import { useState, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { TokenWithIcon } from '@/types/token';
import { TokenIcon } from './TokenIcon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TokenSelectorProps {
  selectedToken: TokenWithIcon | null;
  tokens: TokenWithIcon[];
  onSelect: (token: TokenWithIcon) => void;
  otherToken?: TokenWithIcon | null;
  label: string;
}

export function TokenSelector({
  selectedToken,
  tokens,
  onSelect,
  otherToken,
  label,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTokens = useMemo(() => {
    const query = search.toLowerCase().trim();
    return tokens.filter(
      (token) =>
        token.currency.toLowerCase().includes(query) &&
        token.currency !== otherToken?.currency,
    );
  }, [tokens, search, otherToken]);

  const handleSelect = (token: TokenWithIcon) => {
    onSelect(token);
    setOpen(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="token-button group">
          {selectedToken ? (
            <>
              <TokenIcon
                src={selectedToken.iconUrl}
                alt={selectedToken.currency}
                size="sm"
              />
              <span className="font-semibold">{selectedToken.currency}</span>
            </>
          ) : (
            <span className="font-medium text-muted-foreground">Select</span>
          )}
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Select {label} Token
          </DialogTitle>
        </DialogHeader>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by token name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border/50 focus-visible:ring-primary/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <ScrollArea className="h-[320px] mt-4 -mx-2 px-2">
          <div className="space-y-1">
            {filteredTokens.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tokens found
              </p>
            ) : (
              filteredTokens.map((token) => (
                <button
                  key={token.currency}
                  onClick={() => handleSelect(token)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-token-hover transition-colors group"
                >
                  <TokenIcon src={token.iconUrl} alt={token.currency} />
                  <div className="flex-1 text-left">
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {token.currency}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${token.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
