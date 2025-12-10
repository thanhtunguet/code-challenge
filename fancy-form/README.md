# Token Swap Application

A currency swap interface built with React, TypeScript, and Vite. The app fetches token prices from the Switcheo API and allows users to swap between different currencies with real-time exchange rate calculations.

## How it Works

The swap form has two main inputs - a "from" token and a "to" token. Users select tokens from a searchable dialog, enter an amount, and see the calculated output based on current exchange rates.

**Token Selection**: Click the token selector to open a modal with all available tokens. The list is searchable and shows token icons. You can't select the same token for both inputs.

**Exchange Rate Calculation**: When both tokens are selected and an amount is entered, the app calculates the exchange rate by dividing the "from" token price by the "to" token price. The output amount updates automatically as you type.

**Token Swapping**: The arrow button between inputs swaps the selected tokens and reverses the exchange direction.

**Validation**: The swap button is disabled until you select both tokens and enter a valid amount. Error messages appear directly on the button to guide you.

**Price Updates**: Token prices refresh every 10 seconds from the API. Additionally, when you unfocus from the input field (blur event), prices are refetched after a 250ms debounce to ensure you're always seeing current rates while actively trading. The interface shows a note about the auto-refresh interval at the bottom of the form.

## Code Structure

```
src/
├── components/swap/
│   ├── SwapForm.tsx          # Main form component with state and logic
│   ├── SwapInput.tsx         # Individual token input (reused for from/to)
│   ├── TokenSelector.tsx     # Modal dialog for selecting tokens
│   ├── SwapButton.tsx        # Arrow button for swapping tokens
│   ├── ExchangeRate.tsx      # Exchange rate display
│   └── TokenIcon.tsx         # Token icon with fallback
├── hooks/
│   └── useTokenPrices.ts     # Fetches and processes price data
├── types/
│   └── token.ts              # TypeScript interfaces
├── pages/
│   ├── Index.tsx             # Main page
│   └── NotFound.tsx          # 404 page
├── App.tsx                   # Route configuration (object-based)
└── main.tsx                  # SSG entry point
```

**SwapForm** manages all the state - selected tokens, amounts, and handles the swap logic. It uses `useMemo` to recalculate exchange rates whenever tokens or amounts change.

**useTokenPrices** is a React Query hook that fetches from `https://interview.switcheo.com/prices.json`. It filters out tokens without prices, deduplicates by currency (keeping the most recent), and refetches every 10 seconds.

Token icons are stored in `public/icons/` as SVG files, named by currency code (ETH.svg, BTC.svg, etc.). The TokenIcon component handles missing icons by showing a colored circle with the currency initials.

## SSG Implementation

The app uses `vite-react-ssg` to pre-render pages at build time. This improves initial load performance and SEO.

**Why Route Objects**: vite-react-ssg requires routes to be defined as objects instead of JSX. In `App.tsx`, routes are exported as an array of `RouteObject` types. The layout component wraps all routes with providers (TanStack Query, Toaster, Tooltip) and uses `<Outlet />` for nested routing.

**Entry Point**: `main.tsx` uses `ViteReactSSG()` instead of the standard React `createRoot()`. This function takes the routes and returns a pre-configured app that can be rendered on the server.

**Build Process**: When you run `npm run build`, vite-react-ssg builds the app twice - once for the client and once for the server. It then renders each route on the server and outputs static HTML files. The HTML includes the fully rendered content, not just an empty root div. When the page loads, React hydrates the static HTML and the app becomes interactive.

The `package.json` scripts use `vite-react-ssg` instead of `vite` for both dev and build commands.

## Running the App

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build (with SSG)
npm run build

# Preview production build
npm run preview
```

The dev server runs on `http://localhost:8080`.

## Technologies

- React 18 + TypeScript
- Vite (build tool)
- vite-react-ssg (static generation)
- TanStack Query (data fetching)
- Tailwind CSS + shadcn/ui (styling)
- React Router (routing)

## API Integration

Fetches token prices from `https://interview.switcheo.com/prices.json`. The response contains an array of token objects with currency, date, and price. Some tokens appear multiple times with different dates - we keep the most recent price. Tokens without prices are excluded.

Token icons come from the Switcheo token-icons repository and are stored locally in `public/icons/`.
