import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Shared ESLint config factory for workspace packages.
 * Each package's eslint.config.js should call this with its own
 * `import.meta.dirname` so the TypeScript parser resolves the
 * correct tsconfig for that package.
 *
 * @param {string} tsconfigRootDir
 */
export function createConfig(tsconfigRootDir) {
  return defineConfig([
    globalIgnores(["dist"]),
    {
      files: ["**/*.{ts,tsx}"],
      extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        reactHooks.configs.flat.recommended,
        reactRefresh.configs.vite,
      ],
      languageOptions: {
        globals: globals.browser,
        parserOptions: {
          tsconfigRootDir,
        },
      },
    },
  ]);
}
