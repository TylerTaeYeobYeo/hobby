import { defineConfig } from "vitest/config";

// Unit tests live next to the source they cover, inside the workspace
// packages (core/*, games/*). They all run in jsdom so hooks can use
// localStorage, matchMedia, and the DOM.
export default defineConfig({
  test: {
    environment: "jsdom",
    include: [
      "core/**/src/**/*.test.{ts,tsx}",
      "games/**/src/**/*.test.{ts,tsx}",
    ],
    restoreMocks: true,
  },
});
