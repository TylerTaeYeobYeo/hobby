import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { ThemeContext } from "./theme-context";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  VALID_THEMES,
  type UiTheme,
} from "./theme-types";

const readStoredTheme = (): UiTheme => {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return VALID_THEMES.includes(stored as UiTheme)
    ? (stored as UiTheme)
    : DEFAULT_THEME;
};

export type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: UiTheme;
};

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  defaultTheme,
}) => {
  const [theme, setThemeState] = useState<UiTheme>(
    () => defaultTheme ?? readStoredTheme(),
  );

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: UiTheme) => {
    setThemeState(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
