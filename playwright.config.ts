import { defineConfig, devices } from "@playwright/test";

// End-to-end tests drive the game hub app (apps/game) over a real browser.
// The Vite dev server is started on demand by Playwright; if one is already
// running on port 5173 (e.g. from `npm run dev:game`) it is reused instead.
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev:game",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
