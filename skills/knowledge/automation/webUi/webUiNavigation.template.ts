// Template: Breadcrumb Navigation Helper
// Category: Navigation
// Usage: await BreadcrumbHelper.verifyPath(page, ['Home', 'Settings', 'Profile'])
// Version: 2.0.0 (Tier A - 12+ variants)

import { Page, expect } from '@playwright/test';

/**
 * BreadcrumbHelper - Static utility class for managing Breadcrumb Navigation
 * Supports Ant Design, MUI, Bootstrap and Custom Breadcrumbs
 * 
 * ✅ FEATURES:
 * - Verify path (verifyPath)
 * - Click breadcrumb item (clickItem, clickItemByIndex, clickItemByRegex)
 * - Navigate back (goBack, goHome)
 * - Get path info (getPath, getActiveItem, getSeparator)
 * - Verification (verifyActiveItem, verifyPathOrder, verifySeparator)
 * - Exists (hasItem, hasPath)
 * 
 * @example
 * // Verify path
 * await BreadcrumbHelper.verifyPath(page, ['Home', 'Users', 'Admin'])
 */
export class BreadcrumbHelper {
    // ===== Built-in Selector Patterns =====

    /** Breadcrumb container selectors */
    private static readonly BREADCRUMB_SELECTORS = '.ant-breadcrumb, .breadcrumb, [aria-label="breadcrumb"], nav[class*="breadcrumb"]';

    /** Breadcrumb item selectors */
    private static readonly ITEM_SELECTORS = '.ant-breadcrumb-link, .breadcrumb-item, li[class*="breadcrumb-item"], a[class*="breadcrumb"]';

    /** Separator selectors */
    private static readonly SEPARATOR_SELECTORS = '.ant-breadcrumb-separator, .breadcrumb-separator';

    // ===== 🔥 MAIN Functions =====

    /**
     * 🔥 MAIN: Verify entire Breadcrumb path
     * @param page - Playwright Page
     * @param expectedPath - Array of expected menu names (in order)
     * @param selector - Selector of breadcrumb container
     * 
     * @example
     * await BreadcrumbHelper.verifyPath(page, ['Home', 'Settings', 'Profile'])
     */
    static async verifyPath(page: Page, expectedPath: string[], selector?: string) {
        const container = page.locator(selector || this.BREADCRUMB_SELECTORS);
        await container.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });

        const items = container.locator(this.ITEM_SELECTORS);
        const count = await items.count();

        expect(count, `Breadcrumb item count mismatch. Expected ${expectedPath.length}, found ${count}`).toBe(expectedPath.length);

        for (let i = 0; i < expectedPath.length; i++) {
            await expect(items.nth(i)).toContainText(expectedPath[i]);
        }
    }

    /**
     * Click Breadcrumb item by name
     * @param page - Playwright Page
     * @param itemText - Menu name to click
     * 
     * @example
     * await BreadcrumbHelper.clickItem(page, 'Settings')
     */
    static async clickItem(page: Page, itemText: string) {
        const item = page.locator(this.BREADCRUMB_SELECTORS).locator(this.ITEM_SELECTORS).getByText(itemText, { exact: true });
        await item.click();
    }

    /**
     * Go back to previous page (click the second to last item)
     * @param page - Playwright Page
     * 
     * @example
     * await BreadcrumbHelper.goBack(page)
     */
    static async goBack(page: Page) {
        const items = page.locator(this.BREADCRUMB_SELECTORS).locator(this.ITEM_SELECTORS);
        const count = await items.count();
        if (count > 1) {
            await items.nth(count - 2).click();
        }
    }

    /**
     * Get all current path items
     * @param page - Playwright Page
     * @returns Array of strings (breadcrumb path)
     * 
     * @example
     * const path = await BreadcrumbHelper.getPath(page)
     * // output: ['Home', 'Settings', 'Profile']
     */
    static async getPath(page: Page): Promise<string[]> {
        const items = page.locator(this.BREADCRUMB_SELECTORS).locator(this.ITEM_SELECTORS);
        const count = await items.count();
        const path: string[] = [];

        for (let i = 0; i < count; i++) {
            const text = await items.nth(i).textContent();
            if (text) path.push(text.trim());
        }
        return path;
    }

    // ===== 🔥 NEW: Advanced Features (Tier A) =====

    /**
     * 🔥 Click Breadcrumb item by index
     * @param page - Playwright Page
     * @param index - Index to click (0-based)
     * 
     * @example
     * await BreadcrumbHelper.clickItemByIndex(page, 0) // Click Home
     */
    static async clickItemByIndex(page: Page, index: number): Promise<void> {
        const items = page.locator(this.BREADCRUMB_SELECTORS).locator(this.ITEM_SELECTORS);
        await items.nth(index).click();
    }

    /**
     * 🔥 Click Breadcrumb item using Regular Expression
     * @param page - Playwright Page
     * @param pattern - RegExp pattern to find
     * 
     * @example
     * await BreadcrumbHelper.clickItemByRegex(page, /setting|Setup/i)
     */
    static async clickItemByRegex(page: Page, pattern: RegExp): Promise<void> {
        const item = page.locator(this.BREADCRUMB_SELECTORS).locator(this.ITEM_SELECTORS).filter({ hasText: pattern });
        await item.first().click();
    }

    /**
     * 🔥 Return to Home page (click the first item)
     * @param page - Playwright Page
     * 
     * @example
     * await BreadcrumbHelper.goHome(page)
     */
    static async goHome(page: Page): Promise<void> {
        await this.clickItemByIndex(page, 0);
    }

    /**
     * 🔥 Get the latest menu item (Active Item)
     * @param page - Playwright Page
     * @returns Active item text
     * 
     * @example
     * const current = await BreadcrumbHelper.getActiveItem(page)
     */
    static async getActiveItem(page: Page): Promise<string> {
        const items = page.locator(this.BREADCRUMB_SELECTORS).locator(this.ITEM_SELECTORS);
        const lastItem = items.last();
        return (await lastItem.textContent() || '').trim();
    }

    /**
     * 🔥 Verify the latest menu item (Active Item)
     * @param page - Playwright Page
     * @param expectedText - Expected name
     */
    static async verifyActiveItem(page: Page, expectedText: string | RegExp): Promise<void> {
        const items = page.locator(this.BREADCRUMB_SELECTORS).locator(this.ITEM_SELECTORS);
        await expect(items.last()).toContainText(expectedText);
    }

    /**
     * 🔥 Verify Path Order
     * @param page - Playwright Page
     * @param item1 - Item that must be before
     * @param item2 - Item that must be after
     * 
     * @example
     * await BreadcrumbHelper.verifyPathOrder(page, 'Home', 'Settings')
     */
    static async verifyPathOrder(page: Page, item1: string, item2: string): Promise<void> {
        const path = await this.getPath(page);
        const index1 = path.indexOf(item1);
        const index2 = path.indexOf(item2);

        if (index1 === -1 || index2 === -1) {
            throw new Error(`One or both items not found in path: ${item1}, ${item2}`);
        }

        if (index1 >= index2) {
            throw new Error(`Order mismatch: '${item1}' should be before '${item2}' in ${path.join(' > ')}`);
        }
    }

    /**
     * 🔥 Verify Separator
     * @param page - Playwright Page
     * @param expectedSeparator - Expected separator (e.g., '/', '>')
     */
    static async verifySeparator(page: Page, expectedSeparator: string): Promise<void> {
        const sep = page.locator(this.BREADCRUMB_SELECTORS).locator(this.SEPARATOR_SELECTORS).first();
        await expect(sep).toHaveText(expectedSeparator);
    }

    /**
     * 🔥 Check if specified menu item exists
     * @param page - Playwright Page
     * @param itemText - Menu name
     */
    static async hasItem(page: Page, itemText: string): Promise<boolean> {
        const path = await this.getPath(page);
        return path.includes(itemText);
    }

    /**
     * 🔥 Verify entire Path (Exact Match)
     * @param page - Playwright Page
     * @param expectedPath - Expected path
     */
    static async verifyPathExact(page: Page, expectedPath: string[]): Promise<void> {
        const actualPath = await this.getPath(page);
        expect(actualPath).toEqual(expectedPath);
    }

    /**
     * 🔥 Get all separators
     * @param page - Playwright Page
     */
    static async getSeparators(page: Page): Promise<string[]> {
        const cells = page.locator(this.BREADCRUMB_SELECTORS).locator(this.SEPARATOR_SELECTORS);
        const count = await cells.count();
        const result: string[] = [];

        for (let i = 0; i < count; i++) {
            const text = await cells.nth(i).textContent();
            if (text) result.push(text.trim());
        }
        return result;
    }
}

// ===== Usage Examples =====

// Variant 1: Verify entire Path
/*
import { BreadcrumbHelper } from './webUiNavigation.template';

await BreadcrumbHelper.verifyPath(page, ['Home', 'Settings', 'Profile']);
*/

// Variant 2: Click menu by name
/*
await BreadcrumbHelper.clickItem(page, 'Settings');
*/

// Variant 3: Go back (click upper level menu)
/*
await BreadcrumbHelper.goBack(page);
*/

// Variant 4: Get current Path value
/*
const currentPath = await BreadcrumbHelper.getPath(page);
if (currentPath.includes('Settings')) {
  // Do something
}
*/

// Variant 5: Use Custom Selector
/*
await BreadcrumbHelper.verifyPath(page, ['Home', 'Admin'], '.my-custom-breadcrumb');
*/

// ===== NEW VARIANTS (Tier A) =====

// Variant 6: Click by Index
/*
await BreadcrumbHelper.clickItemByIndex(page, 0); // Go to Home
*/

// Variant 7: Click with RegExp
/*
await BreadcrumbHelper.clickItemByRegex(page, /user|Member/i);
*/

// Variant 8: Return to Home
/*
await BreadcrumbHelper.goHome(page);
*/

// Variant 9: Verify Active Item
/*
const current = await BreadcrumbHelper.getActiveItem(page);
await BreadcrumbHelper.verifyActiveItem(page, 'Profile');
await BreadcrumbHelper.verifyActiveItem(page, /Profile/);
*/

// Variant 10: Verify Path Exact
/*
await BreadcrumbHelper.verifyPathExact(page, ['Home', 'Settings', 'Profile']);
*/

// Variant 11: Verify Path Order
/*
await BreadcrumbHelper.verifyPathOrder(page, 'Home', 'Profile'); // Home must be before Profile
*/

// Variant 12: Verify Separator
/*
await BreadcrumbHelper.verifySeparator(page, '/');
await BreadcrumbHelper.verifySeparator(page, '>');
*/

// Variant 13: Check Item existence
/*
const exists = await BreadcrumbHelper.hasItem(page, 'Payments');
*/

// Variant 14: Combo - Verify and click back
/*
await BreadcrumbHelper.verifyPath(page, ['App', 'Dashboard']);
await BreadcrumbHelper.goBack(page); // Will click App (second to last)
await BreadcrumbHelper.verifyActiveItem(page, 'App');
*/
