import { expect, Page } from '@playwright/test';

class InventoryPage {
    /** @type {Page} */
    page;

    /**
     * @param {Page} page
     */
    constructor(page){
        this.page = page;
        this.inventoryTitle   = this.page.locator('div[class="product_label"]');
        this.productItems     = this.page.locator('.inventory_item');
        this.productNames     = this.page.locator('.inventory_item_name');
        this.productPrices    = this.page.locator('.inventory_item_price');
        this.addButtons       = this.page.locator('[data-test^="add-to-cart"]');
        this.removeButtons    = this.page.locator('[data-test^="remove"]');
        this.cartBadge        = this.page.locator('.shopping_cart_badge');
        this.sortDropdown     = this.page.locator('select[class="product_sort_container"]');
    }

    validateInventoryTitleLoaded = async () => {
        await expect(this.inventoryTitle).toBeVisible();
    }

    getProductCount = async () => {
        return this.productItems.count();
    }

    addItemByIndex = async (index) => {
        await this.addButtons.nth(index).click();
    }

    removeItemByIndex = async (index) => {
        await this.removeButtons.nth(index).click();
    }

    getCartBadgeCount = async () => {
        const text = await this.cartBadge.textContent();
        return parseInt(text, 10);
    }

    sortBy = async (option) => {
        await this.sortDropdown.selectOption(option);
    }

    getAllProductNames = async () => {
        return this.productNames.allTextContents();
    }

    getAllProductPrices = async () => {
        const rawPrices = await this.productPrices.allTextContents();
        return rawPrices.map(p => parseFloat(p.replace('$', '')));
    }

    clickProductByIndex = async (index) => {
        await this.productNames.nth(index).click();
    }
}

export default InventoryPage;