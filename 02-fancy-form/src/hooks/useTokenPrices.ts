import { useQuery } from '@tanstack/react-query';
import { Token, TokenWithIcon } from '@/types/token';

const PRICES_URL = 'https://interview.switcheo.com/prices.json';
const ICON_BASE_URL = '/icons';

async function fetchPrices(): Promise<TokenWithIcon[]> {
  const response = await fetch(PRICES_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch prices');
  }
  
  const data: Token[] = await response.json();
  
  // Filter out tokens without prices and deduplicate by currency
  const tokenMap = new Map<string, TokenWithIcon>();
  
  data.forEach((token) => {
    if (token.price && token.price > 0) {
      // Keep the most recent price for each currency
      const existing = tokenMap.get(token.currency);
      if (!existing || new Date(token.date) > new Date(existing.date)) {
        tokenMap.set(token.currency, {
          ...token,
          iconUrl: `${ICON_BASE_URL}/${token.currency}.svg`,
        });
      }
    }
  });
  
  return Array.from(tokenMap.values()).sort((a, b) => 
    a.currency.localeCompare(b.currency),
  );
}

export const PRICE_UPDATE_INTERVAL = 10000; // 10 seconds

const STALE_TIME = 30000; // 30 seconds

export function useTokenPrices() {
  return useQuery({
    queryKey: ['tokenPrices'],
    queryFn: fetchPrices,
    staleTime: STALE_TIME,
    refetchInterval: PRICE_UPDATE_INTERVAL,
  });
}
