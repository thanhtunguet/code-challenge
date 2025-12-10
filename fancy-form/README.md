# Token Swap Application

A modern, responsive token swap interface built with React, TypeScript, and Vite. Features real-time price updates, server-side rendering with vite-react-ssg, and a beautiful glassmorphism UI design.

## Features

- **Real-Time Price Updates**: Token prices automatically refresh every 10 seconds from Switcheo API
- **Instant Exchange Rate Calculation**: Live conversion rates between selected tokens
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes
- **Server-Side Generation (SSG)**: Pre-rendered pages for optimal SEO and performance
- **Type-Safe**: Full TypeScript implementation with strict type checking
- **Modern UI**: Glassmorphism design with smooth animations and transitions
- **Form Validation**: Real-time input validation with user-friendly error messages
- **Accessibility**: Keyboard navigation and screen reader support

## Technology Stack

### Core Framework
- **React 18.3.1**: Modern React with hooks and concurrent features
- **TypeScript 5.9.3**: Static type checking for enhanced code quality
- **Vite 7.2.4**: Next-generation frontend tooling with fast HMR

### UI & Styling
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components built with Radix UI primitives
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Beautiful & consistent icon set

### State Management & Data Fetching
- **TanStack Query 5.83.0**: Powerful async state management
- **React Hook Form 7.61.1**: Performant form validation
- **Zod 3.25.76**: TypeScript-first schema validation

### Build & Optimization
- **vite-react-ssg 0.8.9**: Static site generation for React applications
- **@vitejs/plugin-react-swc**: Fast refresh with SWC compiler

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fancy-form
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

Generate static site with pre-rendered pages:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── swap/                # Swap form components
│   │   ├── SwapForm.tsx    # Main swap container
│   │   ├── SwapInput.tsx   # Token input with amount
│   │   ├── SwapButton.tsx  # Token swap toggle button
│   │   ├── TokenSelector.tsx # Token selection dialog
│   │   ├── TokenIcon.tsx   # Token icon display
│   │   └── ExchangeRate.tsx # Exchange rate display
│   └── ui/                  # Reusable UI components (shadcn)
├── hooks/
│   ├── useTokenPrices.ts   # Token price fetching hook
│   └── use-toast.ts        # Toast notification hook
├── types/
│   └── token.ts            # TypeScript type definitions
├── pages/
│   ├── Index.tsx           # Main page
│   └── NotFound.tsx        # 404 page
├── App.tsx                 # Route configuration
└── main.tsx                # SSG entry point
```

## Implementation Details

### 1. Server-Side Generation (SSG)

The application uses `vite-react-ssg` to pre-render pages at build time, improving SEO and initial page load performance.

**Configuration** (src/main.tsx):
```typescript
import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App';

export const createRoot = ViteReactSSG({ routes }, ({ router, routes }) => {
  // Custom setup logic
});
```

**Route Structure** (src/App.tsx):
- Routes are defined as objects instead of JSX for SSG compatibility
- Layout component wraps all routes with shared providers
- React Router's `Outlet` enables nested routing

### 2. Real-Time Price Updates

Token prices are fetched using TanStack Query with automatic refetching:

**Implementation** (src/hooks/useTokenPrices.ts):
- Fetches from Switcheo API: `https://interview.switcheo.com/prices.json`
- Deduplicates tokens by currency (keeps most recent price)
- Filters out tokens without valid prices
- Auto-refetches every 10 seconds
- 30-second stale time for cache optimization

### 3. Exchange Rate Calculation

Real-time conversion between selected tokens:

**Algorithm** (src/components/swap/SwapForm.tsx):
```typescript
const rate = fromToken.price / toToken.price;
const outputAmount = inputAmount * rate;
```

Features:
- Memoized calculations for performance
- Automatic recalculation on token or amount change
- USD value display for both input and output
- Formatted numbers with appropriate decimal places

### 4. Token Icon Management

Token icons are stored in the `public/icons/` directory:
- SVG format for scalability
- Named by currency code (e.g., `ETH.svg`, `BTC.svg`)
- Fallback UI for missing icons
- Optimized loading with proper error handling

### 5. Component Architecture

**SwapForm**: Main container managing state and business logic
- Handles token selection and amount input
- Calculates exchange rates and output amounts
- Validates user input
- Manages swap animation and submission

**SwapInput**: Reusable input component
- Amount input with numeric validation
- Token selector integration
- USD value display
- Read-only mode for output

**TokenSelector**: Modal dialog for token selection
- Searchable token list
- Token icons with fallback
- Prevents selecting the same token twice
- Accessible keyboard navigation

### 6. Form Validation

Multi-layer validation approach:
1. **Type-level**: TypeScript ensures type safety
2. **Runtime**: Real-time validation in `SwapForm`
3. **User feedback**: Clear error messages on submit button

Validation rules:
- From token must be selected
- To token must be selected
- Amount must be entered
- Amount must be positive
- Amount cannot be zero

### 7. Styling & Design System

**Glassmorphism Effect**:
- Semi-transparent backgrounds
- Backdrop blur filters
- Subtle borders and shadows
- Glow effects on interactive elements

**Responsive Design**:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Fluid typography and spacing
- Touch-friendly interactive elements

**Dark Mode**:
- Built-in dark theme
- Consistent color palette
- Optimized contrast ratios
- CSS variable-based theming

### 8. Performance Optimizations

1. **Code Splitting**: Route-based lazy loading
2. **Memoization**: `useMemo` and `useCallback` for expensive calculations
3. **Query Optimization**: Smart caching and refetching with TanStack Query
4. **SSG**: Pre-rendered HTML for instant initial load
5. **Asset Optimization**: Compressed images and SVG icons
6. **Tree Shaking**: Vite eliminates unused code

### 9. Type Safety

Comprehensive TypeScript types (src/types/token.ts):

```typescript
export interface Token {
  currency: string;
  date: string;
  price: number;
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
```

## Scripts

- `npm run dev` - Start development server with SSG
- `npm run build` - Build for production with pre-rendering
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## API Integration

**Switcheo Prices API**:
- Endpoint: `https://interview.switcheo.com/prices.json`
- Returns array of token prices with timestamps
- No authentication required
- Updated regularly

## Future Enhancements

- [ ] Wallet integration (MetaMask, WalletConnect)
- [ ] Transaction history
- [ ] Price charts and analytics
- [ ] Multi-language support
- [ ] Slippage tolerance settings
- [ ] Gas fee estimation
- [ ] Favorites and recent tokens

## License

MIT

## Acknowledgments

- Token prices powered by [Switcheo](https://switcheo.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
