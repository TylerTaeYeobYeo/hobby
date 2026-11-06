import { expect, test } from "@playwright/test";

// Drives the sudoku flow end to end: menu → new game → difficulty → board,
// then exercises cell selection, number entry, the memo popup, and clearing.

type Page = import("@playwright/test").Page;

const startNewGame = async (page: Page, difficulty: "easy" | "medium" | "hard") => {
  await page.goto("/sudoku");
  await page.getByRole("button", { name: "New Game" }).click();
  const label = difficulty[0].toUpperCase() + difficulty.slice(1);
  await page.getByRole("button", { name: label, exact: true }).click();
  await page.getByTestId(/cell-0-0/).waitFor({ state: "visible", timeout: 10_000 });
};

// Find the first empty cell plus a number that is not already present in its
// row, column, or box — placing such a value can never trigger the
// game-over dialog, which would hide the number bar.
const findFillableCell = (page: Page) =>
  page.evaluate(() => {
    const val = (r: number, c: number): number =>
      Number(
        document
          .querySelector(`[data-testid="cell-${r}-${c}"]`)
          ?.getAttribute("data-value") ?? 0,
      );
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (val(r, c) !== 0) continue;
        const used = new Set<number>();
        for (let i = 0; i < 9; i++) {
          used.add(val(r, i));
          used.add(val(i, c));
        }
        const boxR = Math.floor(r / 3) * 3;
        const boxC = Math.floor(c / 3) * 3;
        for (let i = boxR; i < boxR + 3; i++)
          for (let j = boxC; j < boxC + 3; j++) used.add(val(i, j));
        for (let n = 1; n <= 9; n++) if (!used.has(n)) return { r, c, num: n };
      }
    }
    return null;
  });

test.describe("sudoku", () => {
  test("starts an easy game with a 9x9 board of givens and empties", async ({
    page,
  }) => {
    await startNewGame(page, "easy");

    const cells = page.getByTestId(/cell-\d+-\d+/);
    await expect(cells).toHaveCount(81);

    const values = await cells.evaluateAll((els) =>
      els.map((el) => el.getAttribute("data-value")),
    );
    expect(values.filter((v) => v === "0").length).toBeGreaterThan(0);
    expect(values.filter((v) => v !== "0").length).toBeGreaterThan(0);
  });

  test("fills the selected empty cell with a number from the bar", async ({
    page,
  }) => {
    await startNewGame(page, "easy");

    const cell = await findFillableCell(page);
    expect(cell).not.toBeNull();
    const target = page.getByTestId(`cell-${cell!.r}-${cell!.c}`);
    await expect(target).toHaveAttribute("data-value", "0");

    await target.click();
    await page.getByTestId(`number-${cell!.num}`).click();

    await expect(target).toHaveAttribute("data-value", String(cell!.num));
  });

  test("toggles a memo value on an empty cell via the popup", async ({ page }) => {
    await startNewGame(page, "easy");

    const cell = await findFillableCell(page);
    expect(cell).not.toBeNull();
    const target = page.getByTestId(`cell-${cell!.r}-${cell!.c}`);

    // The memo popup opens on a right-click (or long-press on touch).
    await target.click({ button: "right" });
    await expect(page.getByTestId("memo-7")).toBeVisible();

    // The cell displays its memo candidates as digits.
    await page.getByTestId("memo-7").click();
    await expect(target).toContainText("7");

    // Toggling the same memo again removes it.
    await page.getByTestId("memo-7").click();
    await expect(target).not.toContainText("7");
  });

  test("clears a filled cell back to empty", async ({ page }) => {
    await startNewGame(page, "easy");

    const cell = await findFillableCell(page);
    expect(cell).not.toBeNull();
    const target = page.getByTestId(`cell-${cell!.r}-${cell!.c}`);

    await target.click();
    await page.getByTestId(`number-${cell!.num}`).click();
    await expect(target).toHaveAttribute("data-value", String(cell!.num));

    await page.getByTestId("clear-cell").click();
    await expect(target).toHaveAttribute("data-value", "0");
  });
});
