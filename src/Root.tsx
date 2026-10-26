import { StrictMode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { App } from './App';

/** Keep the server and browser component trees identical for hydration. */
export function Root({ initialLocation }: { initialLocation: string }) {
  return <StrictMode><App initialLocation={initialLocation} /><Analytics /></StrictMode>;
}
