import { ArrowDownUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwapButtonProps {
  onClick: () => void;
  isAnimating: boolean;
}

export function SwapButton({ onClick, isAnimating }: SwapButtonProps) {
  return (
    <div className="relative flex items-center justify-center -my-2 z-10">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/30" />
      </div>
      <button
        onClick={onClick}
        className={cn(
          'relative p-3 rounded-xl bg-secondary border border-border/50 hover:bg-token-hover hover:border-primary/50 transition-all duration-200 group',
          isAnimating && 'animate-swap-rotate',
        )}
      >
        <ArrowDownUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </button>
    </div>
  );
}
