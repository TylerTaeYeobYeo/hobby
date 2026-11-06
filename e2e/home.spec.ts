import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("shows a card for every game", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Games" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sudoku/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /minesweeper/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /2048/i })).toBeVisible();
  });

  test("navigates to the sudoku menu from its card", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /sudoku/i }).click();

    await expect(page).toHaveURL(/\/sudoku\/?/);
    await expect(
      page.getByRole("button", { name: "New Game" }),
    ).toBeVisible();
  });
});
