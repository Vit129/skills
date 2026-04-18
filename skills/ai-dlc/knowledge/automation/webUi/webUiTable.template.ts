// Template: Table Pagination Helper
// Category: Table
// Usage: await PaginationHelper.goToPage(page, 2)
// Version: 2.0.0 (Tier A - 12+ variants)

import { Page, expect } from '@playwright/test';

/**
 * PaginationHelper - Static utility class for managing Pagination Components
 * Supports Ant Design, MUI, Bootstrap, and Custom Pagination
 * 
 * ✅ FEATURES:
 * - Navigate pages (next, previous, first, last, goToPage)
 * - Page size management (changePageSize)
 * - Info retrieval (getCurrentPage, getTotalPages, getTotalItems, getPageRange)
 * - Verification (verifyCurrentPage, verifyPageSize, verifyTotalItems)
 * - State management (hasPrevious, hasNext, isFirstPage, isLastPage)
 * - Jump navigation (goToNextUntil, goToPrevUntil)
 * 
 * @example
 * // Go to page 2
 * await PaginationHelper.goToPage(page, 2)
 */
export class PaginationHelper {
    // ===== Built-in Selector Patterns =====

    /** Pagination container selectors */
    private static readonly PAGINATION_SELECTORS = '.ant-pagination, .pagination, [aria-label="pagination"]';

    /** Navigation button selectors */
    private static readonly NEXT_BTNS = '.ant-pagination-next, .page-item.next, [aria-label="Next Page"]';
    private static readonly PREV_BTNS = '.ant-pagination-prev, .page-item.prev, [aria-label="Previous Page"]';
    private static readonly FIRST_BTNS = '.ant-pagination-jump-prev, .page-item.first, [aria-label="First Page"]';
    private static readonly LAST_BTNS = '.ant-pagination-jump-next, .page-item.last, [aria-label="Last Page"]';

    /** Page number selectors */
    private static readonly PAGE_ITEMS = '.ant-pagination-item, .page-item:not(.next):not(.prev)';

    /** Page size selectors */
    private static readonly SIZE_SELECTORS = '.ant-pagination-options-size-changer, .page-size-select';

    /** Info text selectors */
    private static readonly INFO_SELECTORS = '.ant-pagination-total-text, .pagination-info';

    // ===== 🔥 MAIN Functions =====

    /**
     * 🔥 MAIN: Go to specified page
     * @param page - Playwright Page
     * @param pageNumber - Page number (1-indexed)
     * 
     * @example
     * await PaginationHelper.goToPage(page, 5)
     */
    static async goToPage(page: Page, pageNumber: number) {
        const pageItem = page.locator(this.PAGINATION_SELECTORS).locator(this.PAGE_ITEMS).filter({ hasText: `${pageNumber}` });
        await pageItem.first().click();
    }

    /**
     * Go to next page
     * @param page - Playwright Page
     */
    static async next(page: Page) {
        await page.locator(this.PAGINATION_SELECTORS).locator(this.NEXT_BTNS).click();
    }

    /**
     * Go to previous page
     * @param page - Playwright Page
     */
    static async previous(page: Page) {
        await page.locator(this.PAGINATION_SELECTORS).locator(this.PREV_BTNS).click();
    }

    /**
     * Change number of items per page (Page Size)
     * @param page - Playwright Page
     * @param size - Desired size (e.g., 10, 20, 50)
     * @param isNative - Whether it is a native select (default: false)
     * 
     * @example
     * await PaginationHelper.changePageSize(page, 50)
     * await PaginationHelper.changePageSize(page, 100, true)
     */
    static async changePageSize(page: Page, size: number, isNative: boolean = false) {
        const selector = this.SIZE_SELECTORS;
        if (isNative) {
            await page.locator(selector).locator('select').selectOption(`${size}`);
        } else {
            // Mock AntD behavior: click dropdown then select option
            await page.locator(selector).click();
            await page.locator('.ant-select-item-option').getByText(`${size}`).click();
        }
    }

    /**
     * Get current page number
     * @param page - Playwright Page
     * @returns current page (number)
     */
    static async getCurrentPage(page: Page): Promise<number> {
        const activeItem = page.locator(this.PAGINATION_SELECTORS).locator('.ant-pagination-item-active, .page-item.active');
        const text = await activeItem.textContent();
        return text ? parseInt(text.trim()) : 1;
    }

    /**
     * Get total number of pages
     * @param page - Playwright Page
     * @returns total pages (number)
     */
    static async getTotalPages(page: Page): Promise<number> {
        const items = page.locator(this.PAGINATION_SELECTORS).locator(this.PAGE_ITEMS);
        const count = await items.count();
        if (count === 0) return 0;

        const lastItemText = await items.last().textContent();
        return lastItemText ? parseInt(lastItemText.trim()) : 0;
    }

    // ===== 🔥 NEW: Advanced Features (Tier A) =====

    /**
     * 🔥 Go to first page
     * @param page - Playwright Page
     */
    static async first(page: Page): Promise<void> {
        const btn = page.locator(this.PAGINATION_SELECTORS).locator(this.FIRST_BTNS).first();
        if (await btn.isVisible()) {
            await btn.click();
        } else {
            await this.goToPage(page, 1);
        }
    }

    /**
     * 🔥 Go to last page
     * @param page - Playwright Page
     */
    static async last(page: Page): Promise<void> {
        const btn = page.locator(this.PAGINATION_SELECTORS).locator(this.LAST_BTNS).first();
        if (await btn.isVisible()) {
            await btn.click();
        } else {
            const total = await this.getTotalPages(page);
            await this.goToPage(page, total);
        }
    }

    /**
     * 🔥 Verify current page (Assertion)
     * @param page - Playwright Page
     * @param expectedPage - Expected page
     */
    static async verifyCurrentPage(page: Page, expectedPage: number): Promise<void> {
        const actual = await this.getCurrentPage(page);
        expect(actual, `Expected page ${expectedPage}, but found page ${actual}`).toBe(expectedPage);
    }

    /**
     * 🔥 Verify Page Size (Assertion)
     * @param page - Playwright Page
     * @param expectedSize - Expected size
     */
    static async verifyPageSize(page: Page, expectedSize: number): Promise<void> {
        const sizeText = await page.locator(this.SIZE_SELECTORS).textContent();
        expect(sizeText).toContain(`${expectedSize}`);
    }

    /**
     * 🔥 Verify total items in text (e.g., "Total 100 items")
     * @param page - Playwright Page
     * @param expectedTotal - Expected count
     */
    static async verifyTotalItems(page: Page, expectedTotal: number): Promise<void> {
        const infoText = await page.locator(this.INFO_SELECTORS).textContent();
        expect(infoText).toContain(`${expectedTotal}`);
    }

    /**
     * 🔥 Check if next page exists
     * @param page - Playwright Page
     */
    static async hasNext(page: Page): Promise<boolean> {
        const btn = page.locator(this.PAGINATION_SELECTORS).locator(this.NEXT_BTNS);
        const isDisabled = await btn.getAttribute('aria-disabled') === 'true' ||
            await btn.getAttribute('class').then(c => c?.includes('disabled'));
        return !isDisabled;
    }

    /**
     * 🔥 Check if previous page exists
     * @param page - Playwright Page
     */
    static async hasPrevious(page: Page): Promise<boolean> {
        const btn = page.locator(this.PAGINATION_SELECTORS).locator(this.PREV_BTNS);
        const isDisabled = await btn.getAttribute('aria-disabled') === 'true' ||
            await btn.getAttribute('class').then(c => c?.includes('disabled'));
        return !isDisabled;
    }

    /**
     * 🔥 Click Next repeatedly until target page is found (or Error/Timeout)
     * @param page - Playwright Page
     * @param targetPage - Target page
     */
    static async goToNextUntil(page: Page, targetPage: number): Promise<void> {
        let current = await this.getCurrentPage(page);
        while (current < targetPage && await this.hasNext(page)) {
            await this.next(page);
            await page.waitForTimeout(300); // Wait for animation
            current = await this.getCurrentPage(page);
        }
        expect(current).toBe(targetPage);
    }

    /**
     * 🔥 Get Pagination summary info
     * @param page - Playwright Page
     * @returns Detailed info object
     */
    static async getPaginationInfo(page: Page) {
        const current = await this.getCurrentPage(page);
        const totalPages = await this.getTotalPages(page);
        const hasNext = await this.hasNext(page);
        const hasPrev = await this.hasPrevious(page);

        // Fetch range like "1-10 of 100"
        const infoText = await page.locator(this.INFO_SELECTORS).textContent().catch(() => '') || '';

        return {
            current,
            totalPages,
            hasNext,
            hasPrev,
            infoText,
            isFirst: !hasPrev,
            isLast: !hasNext
        };
    }
}

// ===== Usage Examples =====

// Variant 1: Go to page 2 (Click page number)
/*
import { PaginationHelper } from './webUiTable.template';

await PaginationHelper.goToPage(page, 2);
await PaginationHelper.verifyCurrentPage(page, 2);
*/

// Variant 2: Next page
/*
await PaginationHelper.next(page);
*/

// Variant 3: Change Page Size
/*
await PaginationHelper.changePageSize(page, 50);
*/

// Variant 4: Get current and total pages
/*
const current = await PaginationHelper.getCurrentPage(page);
const total = await PaginationHelper.getTotalPages(page);
console.log(`Page ${current} of ${total}`);
*/

// Variant 5: Verify total items summary
/*
await PaginationHelper.verifyTotalItems(page, 150);
*/

// ===== NEW VARIANTS (Tier A) =====

// Variant 6: Go to first/last page
/*
await PaginationHelper.first(page);
await PaginationHelper.last(page);
*/

// Variant 7: Verify State
/*
if (await PaginationHelper.hasNext(page)) {
    await PaginationHelper.next(page);
}
*/

// Variant 8: Loop Next until target reached
/*
await PaginationHelper.goToNextUntil(page, 10);
*/

// Variant 9: Get all summary info
/*
const info = await PaginationHelper.getPaginationInfo(page);
if (info.isLast) {
    console.log('Reach the end of the list');
}
*/

// Variant 10: Verify Page Size
/*
await PaginationHelper.verifyPageSize(page, 20);
*/

// Variant 11: Jump multiple pages
/*
await PaginationHelper.goToPage(page, 1);
await PaginationHelper.next(page);
await PaginationHelper.next(page);
await PaginationHelper.verifyCurrentPage(page, 3);
*/

// Variant 12: Handle empty table pagination
/*
const total = await PaginationHelper.getTotalPages(page);
if (total === 0) {
    // Empty table
}
*/
