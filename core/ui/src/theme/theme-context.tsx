import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";

export type UiTheme = "glass" | "neumorphism";

const STORAGE_KEY = "uiTheme";

export type ThemeContextValue = {
  theme: UiTheme;
  setTheme: (theme: UiTheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const readStoredTheme = (): UiTheme => {
  if (typeof window === "undefined") return "glass";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "neumorphism" ? "neumorphism" : "glass";
};

export const ThemeProvider: FC<{
  children: ReactNode;
  defaultTheme?: UiTheme;
}> = ({ children, defaultTheme }) => {
  const [theme, setThemeState] = useState<UiTheme>(
    () => defaultTheme ?? readStoredTheme(),
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: UiTheme) => {
    setThemeState(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback so components can be used outside a provider (defaults to glass).
    return { theme: "glass", setTheme: () => {} };
  }
  return ctx;
};
