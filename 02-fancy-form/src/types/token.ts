export interface Token {
  currency: string;

  price: number;

  date: string;
}

export interface TokenWithIcon extends Token {
  iconUrl: string;
}

export interface SwapState {
  fromToken: TokenWithIcon | null;
  
  toToken: TokenWithIcon | null;
  
  fromAmount: string;
  
  toAmount: string;
}
