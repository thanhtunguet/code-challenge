import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App';
import './index.css';

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, routes, isClient, initialState }) => {
    // Custom setup logic can be added here if needed
  },
);
