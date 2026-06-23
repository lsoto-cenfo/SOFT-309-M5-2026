import { test, expect } from "@playwright/test";
import LoginPage from "../tests/pages/Login.page.js";
import InventoryPage from "../tests/pages/Inventory.page.js";

const BASE_URL = "https://www.saucedemo.com/v1/index.html";
const CREDENTIALS = { user: "standard_user", password: "secret_sauce" };
const TOTAL_PRODUCTS = 6;

// Generate 100 identical suites — 8 tests × 100 runs = 800 total.
// Each suite gets a unique name so Playwright tracks them independently.
for (let run = 1; run <= 100; run++) {
  test.describe(`Inventory Page [run ${run}]`, () => {
    let login, inventory;

    test.beforeEach(async ({ page }) => { // Hooks 
      await page.goto(BASE_URL);
      login = new LoginPage(page);
      inventory = new InventoryPage(page);
      await login.doLogin(CREDENTIALS.user, CREDENTIALS.password);
      await page.waitForURL("**/inventory.html");
      await inventory.productItems.first().waitFor({ state: "visible" });
    });

    test("should display all 6 products @smoke", async () => {
      const count = await inventory.getProductCount();
      expect(count).toBe(TOTAL_PRODUCTS);
    });

    test("should add a random product and update cart badge to 1 @smoke", async () => {
      const count = await inventory.getProductCount();
      const randomIndex = Math.floor(Math.random() * count);
      await inventory.addItemByIndex(randomIndex);
      const badgeCount = await inventory.getCartBadgeCount();
      expect(badgeCount).toBe(1);
    });

    test("should remove an added product and hide cart badge", async () => {
      await inventory.addItemByIndex(0);
      await inventory.removeItemByIndex(0);
      await expect(inventory.cartBadge).not.toBeVisible();
    });

    test("should reflect correct count when adding multiple products", async () => {
      await inventory.addItemByIndex(0);
      await inventory.addItemByIndex(1);
      await inventory.addItemByIndex(2);
      const badgeCount = await inventory.getCartBadgeCount();
      expect(badgeCount).toBe(3);
    });

    test("should sort products by price low to high", async () => {
      await inventory.sortBy("lohi");
      const prices = await inventory.getAllProductPrices();
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });

    test("should sort products by price high to low", async () => {
      await inventory.sortBy("hilo");
      const prices = await inventory.getAllProductPrices();
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    });

    test("should sort products by name Z to A", async () => {
      await inventory.sortBy("za");
      const names = await inventory.getAllProductNames();
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(sorted);
    });

    test("should navigate to product detail page on name click", async ({ page }) => {
      const firstName = (await inventory.getAllProductNames())[0];
      await inventory.clickProductByIndex(0);
      await page.waitForURL("**/inventory-item.html**");
      const detailName = await page.locator(".inventory_details_name").textContent();
      expect(detailName).toBe(firstName);
    });
  });
}
