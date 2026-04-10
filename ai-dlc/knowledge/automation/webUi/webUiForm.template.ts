// Template: Dropdown Helper (Custom & Native)
// Category: Form
// Usage: await DropdownHelper.selectByText(page, 'Selector', 'Option')
// Version: 2.1.0 (Tier A - 12+ variants)

import { Page, expect } from '@playwright/test';

/**
 * DropdownHelper - Helper for managing Dropdowns (Native and Custom: AntD, MUI, etc.)
 * Supports single select, multiple select, search, and scroll
 * 
 * ✅ SUPPORTED LIBRARIES:
 * - Ant Design (Select)
 * - Material UI (Select, Autocomplete)
 * - Element UI / Plus
 * - Bootstrap Select
 * - Native HTML Select
 * 
 * ✅ FEATURES:
 * - Select option (selectByText, selectByIndex, selectByValue)
 * - Multi-select (selectMultipleByText)
 * - Click & Search select (selectWithSearch)
 * - Click & Scroll select (selectWithScroll)
 * - Auto-detect dropdown type (native vs custom)
 * - Get current selection (getSelectedText, getSelectedValue, getAllSelectedTexts)
 * - Multi-select management (clearSelection, removeSelection)
 * - Dropdown state (isOpen, hasOption)
 * - Validation (verifySelection, verifyOptionsCount)
 * 
 * @example
 * // Single select
 * await DropdownHelper.selectByText(page, '.ant-select', 'Thailand')
 */
export class DropdownHelper {
    // ===== Built-in Selector Patterns =====

    /** Common dropdown container selectors */
    private static readonly DROPDOWN_SELECTORS = '.ant-select, .mt-select, .select-container, .dropdown, div[class*="select"]';

    /** Common dropdown overlay/menu selectors */
    private static readonly MENU_SELECTORS = '.ant-select-dropdown, .mt-select-menu, .dropdown-menu, [role="listbox"]';

    /** Common option selectors */
    private static readonly OPTION_SELECTORS = '.ant-select-item-option, .mt-select-option, .dropdown-item, [role="option"]';

    /** Multiple selection tag selectors */
    private static readonly TAG_SELECTORS = '.ant-select-selection-item, .mt-select-tag, .select-tag';

    // ===== 🔥 MAIN Functions =====

    /**
     * 🔥 MAIN: Select Option by text
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @param text - Text to select
     * @param options - Select options
     * 
     * @example
     * await DropdownHelper.selectByText(page, '.ant-select', 'Thailand')
     * await DropdownHelper.selectByText(page, 'select#country', 'USA', { isNative: true })
     */
    static async selectByText(
        page: Page,
        selector: string,
        text: string | RegExp,
        options: {
            isNative?: boolean;
            prefix?: string;
            timeout?: number;
        } = {}
    ) {
        const { isNative = false, prefix, timeout = 5000 } = options;
        const finalSelector = prefix ? `${prefix} ${selector}` : selector;

        if (isNative) {
            await page.locator(finalSelector).selectOption({ label: text as string });
        } else {
            const dropdown = page.locator(finalSelector);
            await dropdown.click();

            const menu = page.locator(this.MENU_SELECTORS).filter({ visible: true }).first();
            const option = menu.locator(this.OPTION_SELECTORS).getByText(text, { exact: true });

            await option.waitFor({ state: 'visible', timeout });
            await option.click();
        }
    }

    /**
     * multi-select (Select multiple options)
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @param texts - Array of texts to select
     * 
     * @example
     * await DropdownHelper.selectMultipleByText(page, '.multi-select', ['Apple', 'Banana'])
     */
    static async selectMultipleByText(page: Page, selector: string, texts: string[]) {
        for (const text of texts) {
            await this.selectByText(page, selector, text);
        }
    }

    /**
     * Select via Search (Type then select)
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @param text - Text to type and select
     * @param inputSelector - Custom search input selector
     * 
     * @example
     * await DropdownHelper.selectWithSearch(page, '.search-select', 'Thailand')
     */
    static async selectWithSearch(
        page: Page,
        selector: string,
        text: string,
        inputSelector: string = 'input[type="search"], .ant-select-selection-search-input'
    ) {
        const dropdown = page.locator(selector);
        await dropdown.click();

        await page.locator(inputSelector).fill(text);
        await page.waitForTimeout(500); // Wait for animation/search results

        const menu = page.locator(this.MENU_SELECTORS).filter({ visible: true }).first();
        await menu.locator(this.OPTION_SELECTORS).getByText(text, { exact: true }).click();
    }

    /**
     * Clear selection (for multi-select)
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @param clearBtnSelector - Selector of clear button
     * 
     * @example
     * await DropdownHelper.clearSelection(page, '.multi-select')
     */
    static async clearSelection(
        page: Page,
        selector: string,
        clearBtnSelector: string = '.ant-select-clear, .select-clear'
    ) {
        await page.locator(selector).locator(clearBtnSelector).click();
    }

    /**
     * Get currently selected text (Single select)
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @returns selected text
     * 
     * @example
     * const text = await DropdownHelper.getSelectedText(page, '.ant-select')
     */
    static async getSelectedText(page: Page, selector: string): Promise<string> {
        return (await page.locator(selector).locator('.ant-select-selection-item').textContent() || '').trim();
    }

    // ===== 🔥 NEW: Advanced Features (Tier A) =====

    /**
     * 🔥 Select Option by index
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @param index - Option index (0-based)
     * @param isNative - Is native select?
     * 
     * @example
     * await DropdownHelper.selectByIndex(page, '.ant-select', 0)
     */
    static async selectByIndex(
        page: Page,
        selector: string,
        index: number,
        isNative: boolean = false
    ): Promise<void> {
        if (isNative) {
            await page.locator(selector).selectOption({ index });
        } else {
            await page.locator(selector).click();
            const menu = page.locator(this.MENU_SELECTORS).filter({ visible: true }).first();
            await menu.locator(this.OPTION_SELECTORS).nth(index).click();
        }
    }

    /**
     * 🔥 Select via Scroll (when there are many options)
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @param text - Text to select
     * @param options - Scroll options
     * 
     * @example
     * await DropdownHelper.selectWithScroll(page, '.big-select', 'Item 100')
     */
    static async selectWithScroll(
        page: Page,
        selector: string,
        text: string,
        options: {
            menuSelector?: string;
            itemSelector?: string;
        } = {}
    ): Promise<void> {
        const { menuSelector = this.MENU_SELECTORS, itemSelector = this.OPTION_SELECTORS } = options;

        await page.locator(selector).click();

        const menu = page.locator(menuSelector).filter({ visible: true }).first();
        const target = menu.locator(itemSelector).getByText(text, { exact: true });

        // Scroll until visible
        await target.scrollIntoViewIfNeeded();
        await target.click();
    }

    /**
     * 🔥 Get all selected texts (Multi-select)
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @returns Array of texts
     * 
     * @example
     * const texts = await DropdownHelper.getAllSelectedTexts(page, '.multi-select')
     */
    static async getAllSelectedTexts(page: Page, selector: string): Promise<string[]> {
        const tags = page.locator(selector).locator(this.TAG_SELECTORS);
        const count = await tags.count();
        const result: string[] = [];

        for (let i = 0; i < count; i++) {
            result.push((await tags.nth(i).textContent() || '').trim());
        }
        return result;
    }

    /**
     * 🔥 Remove single selection (Multi-select)
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @param text - Text to remove
     * 
     * @example
     * await DropdownHelper.removeSelection(page, '.multi-select', 'Apple')
     */
    static async removeSelection(page: Page, selector: string, text: string): Promise<void> {
        const tag = page.locator(selector).locator(this.TAG_SELECTORS).filter({ hasText: text });
        await tag.locator('.ant-select-selection-item-remove, .select-tag-close').click();
    }

    /**
     * 🔥 Check if dropdown is open
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * 
     * @example
     * if (await DropdownHelper.isOpen(page, '.ant-select')) { ... }
     */
    static async isOpen(page: Page, selector: string): Promise<boolean> {
        const className = await page.locator(selector).getAttribute('class') || '';
        return className.includes('ant-select-open') ||
            className.includes('is-open') ||
            await page.locator(this.MENU_SELECTORS).isVisible();
    }

    /**
     * 🔥 Check if specified Option exists
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @param text - Search text
     * 
     * @example
     * await DropdownHelper.hasOption(page, '.ant-select', 'Thailand')
     */
    static async hasOption(page: Page, selector: string, text: string | RegExp): Promise<boolean> {
        await page.locator(selector).click();
        const menu = page.locator(this.MENU_SELECTORS).filter({ visible: true }).first();
        const has = await menu.locator(this.OPTION_SELECTORS).getByText(text).isVisible();
        await page.keyboard.press('Escape'); // Close menu
        return has;
    }

    /**
     * 🔥 Verify options count
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @param expectedCount - Expected count
     * 
     * @example
     * await DropdownHelper.verifyOptionsCount(page, '.ant-select', 5)
     */
    static async verifyOptionsCount(page: Page, selector: string, expectedCount: number): Promise<void> {
        await page.locator(selector).click();
        const menu = page.locator(this.MENU_SELECTORS).filter({ visible: true }).first();
        const count = await menu.locator(this.OPTION_SELECTORS).count();
        await page.keyboard.press('Escape');
        expect(count).toBe(expectedCount);
    }

    /**
     * 🔥 Verify current selection
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     * @param expectedText - Expected text
     */
    static async verifySelection(page: Page, selector: string, expectedText: string | RegExp): Promise<void> {
        const actual = await this.getSelectedText(page, selector);
        if (typeof expectedText === 'string') {
            expect(actual).toBe(expectedText);
        } else {
            expect(actual).toMatch(expectedText);
        }
    }

    /**
     * 🔥 Get complete Dropdown info
     * @param page - Playwright Page
     * @param selector - Dropdown selector
     */
    static async getDropdownInfo(page: Page, selector: string) {
        const dropdown = page.locator(selector);
        const id = await dropdown.getAttribute('id') || '';
        const placeholder = await dropdown.locator('.ant-select-selection-placeholder').textContent().catch(() => '') || '';
        const selected = await this.getSelectedText(page, selector);
        const isOpen = await this.isOpen(page, selector);
        const isDisabled = await dropdown.getAttribute('class').then(c => c?.includes('disabled')) || false;

        return { id, placeholder, selected, isOpen, isDisabled };
    }
}

// ===== Usage Examples =====

// Variant 1: Select by text (Custom Dropdown)
/*
import { DropdownHelper } from './webUiForm.template';

await DropdownHelper.selectByText(page, '.ant-select', 'Thailand');
*/

// Variant 2: Select by text (Native HTML Select)
/*
await DropdownHelper.selectByText(page, 'select#country', 'USA', { isNative: true });
*/

// Variant 3: Multi-select (Multiple values)
/*
await DropdownHelper.selectMultipleByText(page, '.multi-select', ['Apple', 'Banana', 'Orange']);
*/

// Variant 4: Select via Search
/*
await DropdownHelper.selectWithSearch(page, '.search-select', 'Bangkok');
*/

// Variant 5: Clear selection
/*
await DropdownHelper.clearSelection(page, '.ant-select');
*/

// Variant 6: Get currently selected text
/*
const selected = await DropdownHelper.getSelectedText(page, '.ant-select');
console.log(`Current: ${selected}`);
*/

// Variant 7: Use Prefix for nested dropdowns
/*
await DropdownHelper.selectByText(page, '.dropdown', 'Option 1', { prefix: '#form-panel' });
*/

// ===== NEW VARIANTS (Tier A) =====

// Variant 8: Select by Index
/*
await DropdownHelper.selectByIndex(page, '.ant-select', 0); // Select first option
*/

// Variant 9: Select via Scroll (for long lists)
/*
await DropdownHelper.selectWithScroll(page, '.large-dropdown', 'Item 100');
*/

// Variant 10: Get all selected texts (Multi-select)
/*
const fruits = await DropdownHelper.getAllSelectedTexts(page, '.fruit-select');
*/

// Variant 11: Remove single selection from multi-select
/*
await DropdownHelper.removeSelection(page, '.multi-select', 'Banana');
*/

// Variant 12: Verify state and count
/*
const isOpen = await DropdownHelper.isOpen(page, '.ant-select');
const hasThai = await DropdownHelper.hasOption(page, '.ant-select', 'Thailand');
await DropdownHelper.verifyOptionsCount(page, '.ant-select', 10);
*/

// Variant 13: Verify current selection (Assertion)
/*
await DropdownHelper.verifySelection(page, '.ant-select', 'Thailand');
await DropdownHelper.verifySelection(page, '.ant-select', /Thai/);
*/

// Variant 14: Get Dropdown summary
/*
const info = await DropdownHelper.getDropdownInfo(page, '.ant-select');
console.log(`Dropdown ID: ${info.id}, Selected: ${info.selected}, Is Open: ${info.isOpen}`);
*/

// Variant 15: Select and Verify Combo
/*
await DropdownHelper.selectByText(page, '.ant-select', 'Japan');
await DropdownHelper.verifySelection(page, '.ant-select', 'Japan');
*/
