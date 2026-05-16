import { test, expect } from "@playwright/test";

test.describe("Checkout Smoke Tests 👹", () => {

  test("should add item to cart", async ({ page }) => {

    await page.goto("/");

    await page.click(
      '[data-testid="add-to-cart"]'
    );

    await expect(
      page.locator(
        '[data-testid="cart-count"]'
      )
    ).toContainText("1");

  });

  test("should show checkout button", async ({ page }) => {

    await page.goto("/");

    await expect(
      page.locator(
        '[data-testid="checkout-button"]'
      )
    ).toBeVisible();

  });

  test("should allow promo input", async ({ page }) => {

    await page.goto("/");

    await page.fill(
      '[data-testid="promo-input"]',
      "SAVE10"
    );

    await expect(
      page.locator(
        '[data-testid="promo-input"]'
      )
    ).toHaveValue("SAVE10");

  });

  test("should navigate to checkout", async ({ page }) => {

    await page.goto("/");

    await page.click(
      '[data-testid="checkout-button"]'
    );

    await expect(page).toHaveURL(
      /.*checkout/
    );

  });

});