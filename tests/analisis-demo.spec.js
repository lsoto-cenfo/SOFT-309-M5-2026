/**
 * Suite para la clase: Análisis de resultados de pruebas.
 *
 * Contiene fallos INTENCIONALES de distintos tipos para que los estudiantes
 * practiquen la lectura de reportes (Playwright HTML + Allure).
 *
 * Ejecutar:  npm run test:analisis
 * Reportes:  npm run report:pw   |   npm run report:allure
 */
import { test, expect } from "@playwright/test";
import LoginPage from "./pages/Login.page.js";
import InventoryPage from "./pages/Inventory.page.js";

const BASE_URL = "https://www.saucedemo.com/v1/index.html";
const API_BASE = "https://dummyjson.com";

// ── UI — SauceDemo ──────────────────────────────────────────────────────────

test.describe("Análisis UI @analisis", () => {
  test("OK: login exitoso y productos visibles @analisis", async ({ page }) => {
    await page.goto(BASE_URL);
    const login = new LoginPage(page);
    await login.doLogin("standard_user", "secret_sauce");
    await page.waitForURL("**/inventory.html");
    await expect(page.locator(".inventory_item").first()).toBeVisible();
  });

  test("FALLA: aserción incorrecta — espera 7 productos @analisis", async ({ page }) => {
    await page.goto(BASE_URL);
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    await login.doLogin("standard_user", "secret_sauce");
    await page.waitForURL("**/inventory.html");
    await inventory.productItems.first().waitFor({ state: "visible" });

    const count = await inventory.getProductCount();
    expect(count).toBe(7); // real: 6
  });

  test("FALLA: credenciales inválidas — no llega al inventario @analisis", async ({ page }) => {
    await page.goto(BASE_URL);
    const login = new LoginPage(page);
    await login.doLogin("usuario_inexistente", "clave_mala");
    await expect(page.locator(".inventory_item").first()).toBeVisible();
  });

  test("FALLA: selector inexistente @analisis", async ({ page }) => {
    await page.goto(BASE_URL);
    const login = new LoginPage(page);
    await login.doLogin("standard_user", "secret_sauce");
    await page.waitForURL("**/inventory.html");
    await expect(page.locator(".producto-que-no-existe")).toBeVisible();
  });

  test("FALLA: lógica invertida en ordenamiento @analisis", async ({ page }) => {
    await page.goto(BASE_URL);
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    await login.doLogin("standard_user", "secret_sauce");
    await page.waitForURL("**/inventory.html");
    await inventory.productItems.first().waitFor({ state: "visible" });

    await inventory.sortBy("lohi");
    const prices = await inventory.getAllProductPrices();
    const sortedDesc = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedDesc); // ordena low→high pero valida high→low
  });

  test("OK: badge del carrito tras agregar producto @analisis", async ({ page }) => {
    await page.goto(BASE_URL);
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    await login.doLogin("standard_user", "secret_sauce");
    await page.waitForURL("**/inventory.html");
    await inventory.productItems.first().waitFor({ state: "visible" });

    await inventory.addItemByIndex(0);
    expect(await inventory.getCartBadgeCount()).toBe(1);
  });

  test("FALLA: URL incorrecta en detalle de producto @analisis", async ({ page }) => {
    await page.goto(BASE_URL);
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    await login.doLogin("standard_user", "secret_sauce");
    await page.waitForURL("**/inventory.html");
    await inventory.productItems.first().waitFor({ state: "visible" });

    await inventory.clickProductByIndex(0);
    await page.waitForURL("**/inventory-item.html**");
    expect(page.url()).toContain("checkout.html");
  });
});

// ── API — DummyJSON ───────────────────────────────────────────────────────────

test.describe("Análisis API @analisis", () => {
  test("OK: GET /users responde 200 @analisis", async ({ request }) => {
    const res = await request.get(`${API_BASE}/users`);
    expect(res.status()).toBe(200);
  });

  test("FALLA: status code incorrecto @analisis", async ({ request }) => {
    const res = await request.get(`${API_BASE}/users/1`);
    expect(res.status()).toBe(404); // real: 200
  });

  test("FALLA: valor de campo incorrecto @analisis", async ({ request }) => {
    const res = await request.get(`${API_BASE}/users/1`);
    const data = await res.json();
    expect(data.firstName).toBe("Carlos"); // real: Emily
  });

  test("FALLA: límite de paginación no respetado @analisis", async ({ request }) => {
    const res = await request.get(`${API_BASE}/products?limit=5&skip=0`);
    const data = await res.json();
    expect(data.products.length).toBe(10); // real: ≤ 5
  });

  test("OK: POST /products/add crea producto @analisis", async ({ request }) => {
    const res = await request.post(`${API_BASE}/products/add`, {
      data: { title: "Producto Clase", price: 42 },
    });
    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Producto Clase");
  });

  test("FALLA: categoría incorrecta en filtro @analisis", async ({ request }) => {
    const res = await request.get(`${API_BASE}/products/category/smartphones`);
    const data = await res.json();
    data.products.forEach((p) => expect(p.category).toBe("laptops"));
  });
});
