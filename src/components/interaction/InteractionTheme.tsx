import { createContext, useContext } from 'react';
export const InteractionThemeContext = createContext<{
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}>({ theme: 'light', onThemeChange: () => {} });
export function useInteractionTheme() {
  return useContext(InteractionThemeContext);
}
export function useTheme(): { theme: string; systemTheme: string } {
  const { theme } = useInteractionTheme();
  return { theme, systemTheme: theme };
}
