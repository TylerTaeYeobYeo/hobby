export type UiTheme =
  | "glass"
  | "neumorphism"
  | "material"
  | "cupertino"
  | "cyberpunk";

export type ThemeContextValue = {
  theme: UiTheme;
  setTheme: (theme: UiTheme) => void;
};

export const VALID_THEMES: UiTheme[] = [
  "glass",
  "neumorphism",
  "material",
  "cupertino",
  "cyberpunk",
];

export const DEFAULT_THEME: UiTheme = "material";

export const THEME_STORAGE_KEY = "uiTheme";
