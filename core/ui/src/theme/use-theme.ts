import { useContext } from "react";
import { ThemeContext } from "./theme-context";
import { DEFAULT_THEME, type ThemeContextValue } from "./theme-types";

/**
 * Access the current UI theme and a setter to change it.
 * Safe to call outside a `ThemeProvider`; falls back to the default theme.
 */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: DEFAULT_THEME, setTheme: () => {} };
  }
  return ctx;
};
