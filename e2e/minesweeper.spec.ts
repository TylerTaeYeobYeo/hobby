import { expect, test } from "@playwright/test";

// Minesweeper e2e: menu → new game → easy (9x9), then verify the grid and
// that a first click reveals at least one cell (first-click is mine-safe).

test.describe("minesweeper", () => {
  test("starts an easy game with 81 hidden cells", async ({ page }) => {
    await page.goto("/minesweeper");
    await page.getByRole("button", { name: "New Game" }).click();
    await page.getByRole("button", { name: "Easy", exact: true }).click();
    await page
      .getByTestId(/cell-0-0/)
      .waitFor({ state: "visible", timeout: 10_000 });

    const cells = page.getByTestId(/cell-\d+-\d+/);
    await expect(cells).toHaveCount(81);
    const states = await cells.evaluateAll((els) =>
      els.map((el) => el.getAttribute("data-state")),
    );
    expect(states.every((s) => s === "hidden")).toBe(true);
  });

  test("reveals at least one cell on the first click", async ({ page }) => {
    await page.goto("/minesweeper");
    await page.getByRole("button", { name: "New Game" }).click();
    await page.getByRole("button", { name: "Easy", exact: true }).click();
    await page
      .getByTestId(/cell-0-0/)
      .waitFor({ state: "visible", timeout: 10_000 });

    const first = page.getByTestId("cell-4-4");
    await first.click();

    // First click is guaranteed mine-safe and reveals its cell (and often a
    // flood-fill region), so at least one cell must be revealed.
    const states = await page
      .getByTestId(/cell-\d+-\d+/)
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-state")));
    expect(states.filter((s) => s === "revealed").length).toBeGreaterThan(0);
  });
});
