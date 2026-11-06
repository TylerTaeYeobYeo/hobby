import { expect, test } from "@playwright/test";

// The 2048 game renders a fixed 4x4 grid of 16 tiles, each exposing its
// value through data-value.

const tileSnapshot = (page: import("@playwright/test").Page) =>
  page
    .getByTestId(/tile-\d+-\d+/)
    .evaluateAll((els) =>
      els.map((el) => `${el.getAttribute("data-testid")}=${el.getAttribute("data-value")}`).sort(),
    )
    .then((parts) => parts.join(","));

test.describe("2048", () => {
  test("starts with exactly two starter tiles", async ({ page }) => {
    await page.goto("/2048");
    await page.getByRole("button", { name: "New Game" }).click();
    await page.getByTestId(/tile-0-0/).waitFor({ state: "visible", timeout: 10_000 });

    const tiles = page.getByTestId(/tile-\d+-\d+/);
    await expect(tiles).toHaveCount(16);

    const values = await tiles.evaluateAll((els) =>
      els.map((el) => Number(el.getAttribute("data-value"))),
    );
    expect(values.filter((v) => v === 2 || v === 4)).toHaveLength(2);
    expect(values.filter((v) => v === 0)).toHaveLength(14);
  });

  test("responds to keyboard moves by changing the board", async ({ page }) => {
    await page.goto("/2048");
    await page.getByRole("button", { name: "New Game" }).click();
    await page.getByTestId(/tile-0-0/).waitFor({ state: "visible", timeout: 10_000 });

    const before = await tileSnapshot(page);

    // Try the four directions; a random start board may be inert in one or
    // two of them, but at least one must produce a visible change.
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    let after = before;
    for (const key of keys) {
      await page.keyboard.press(key);
      after = await tileSnapshot(page);
      if (after !== before) break;
    }
    expect(after).not.toBe(before);

    // The board keeps 16 tiles and at least two live tiles after a move.
    const values = await page
      .getByTestId(/tile-\d+-\d+/)
      .evaluateAll((els) => els.map((el) => Number(el.getAttribute("data-value"))));
    expect(values).toHaveLength(16);
    expect(values.filter((v) => v >= 2).length).toBeGreaterThanOrEqual(2);
  });
});
