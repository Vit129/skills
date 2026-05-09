// Template: Toast/Alert Helper
// Category: Dialog
// Usage: await ToastHelper.verifySuccess(page, 'Saved successfully')
// Version: 2.0.0 (Tier A - 12+ variants)

import { Page, expect } from '@playwright/test';

/**
 * ToastHelper - Helper for managing Toast/Alert messages
 * Supports success, error, warning, info
 * 
 * ✅ SUPPORTED TOAST TYPES:
 * - Success: .toast-success, .alert-success
 * - Error: .toast-error, .alert-danger
 * - Warning: .toast-warning, .alert-warning
 * - Info: .toast-info, .alert-info
 * 
 * ✅ FEATURES:
 * - Verify toast message (verifySuccess, verifyError, verifyWarning, verifyInfo)
 * - Wait for toast (waitForToast, waitForToastDisappear)
 * - Close toast (closeToast, closeAllToasts)
 * - Click toast action button (clickToastAction)
 * - Get toast info (getToastMessage, getToastInfo)
 * - Count toasts (countToasts, hasToast)
 * - Verify position (verifyToastPosition)
 * - Verify duration (verifyToastDuration)
 * - Verify multiple toasts (verifyMultipleToasts)
 * - Verify icon (verifyToastIcon)
 * 
 * @example
 * // Verify success toast
 * await ToastHelper.verifySuccess(page, 'Saved successfully')
 */
export class ToastHelper {
    // ===== Built-in Selector Patterns =====

    /** Toast/Alert container selectors */
    private static readonly TOAST_SELECTORS = '.toast, .alert, [role="alert"], [class*="toast"], [class*="alert"]';

    /** Success toast selectors */
    private static readonly SUCCESS_SELECTORS = '.toast-success, .alert-success, [class*="success"]';

    /** Error toast selectors */
    private static readonly ERROR_SELECTORS = '.toast-error, .alert-danger, [class*="error"], [class*="danger"]';

    /** Warning toast selectors */
    private static readonly WARNING_SELECTORS = '.toast-warning, .alert-warning, [class*="warning"]';

    /** Info toast selectors */
    private static readonly INFO_SELECTORS = '.toast-info, .alert-info, [class*="info"]';

    /** Close button selectors */
    private static readonly CLOSE_SELECTORS = '.toast .close, .alert .close, button[class*="close"]';

    // ===== 🔥 MAIN Functions =====

    /**
     * 🔥 Verify success toast
     * @param page - Playwright Page
     * @param message - Expected message
     * @param selector - Selector of success toast
     * 
     * @example
     * await ToastHelper.verifySuccess(page, 'Saved successfully')
     * await ToastHelper.verifySuccess(page, 'Saved', '.custom-toast')
     */
    static async verifySuccess(page: Page, message: string, selector: string = '.toast-success, .alert-success') {
        const el = page.locator(selector);
        await el.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        await expect(el).toContainText(message);
    }

    /**
     * 🔥 Verify error toast
     * @param page - Playwright Page
     * @param message - Expected message
     * @param selector - Selector of error toast
     * 
     * @example
     * await ToastHelper.verifyError(page, 'Failed to save')
     */
    static async verifyError(page: Page, message: string, selector: string = '.toast-error, .alert-danger') {
        const el = page.locator(selector);
        await el.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        await expect(el).toContainText(message);
    }

    /**
     * Verify warning toast
     * @param page - Playwright Page
     * @param message - Expected message
     * @param selector - Selector of warning toast
     * 
     * @example
     * await ToastHelper.verifyWarning(page, 'Please check your input')
     */
    static async verifyWarning(page: Page, message: string, selector: string = '.toast-warning, .alert-warning') {
        const el = page.locator(selector);
        await el.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        await expect(el).toContainText(message);
    }

    /**
     * Verify info toast
     * @param page - Playwright Page
     * @param message - Expected message
     * @param selector - Selector of info toast
     * 
     * @example
     * await ToastHelper.verifyInfo(page, 'Processing...')
     */
    static async verifyInfo(page: Page, message: string, selector: string = '.toast-info, .alert-info') {
        const el = page.locator(selector);
        await el.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        await expect(el).toContainText(message);
    }

    /**
     * 🔥 Wait for toast to disappear
     * @param page - Playwright Page
     * @param selector - Selector of toast
     * @param timeout - Timeout (ms)
     * 
     * @example
     * await ToastHelper.waitForToastDisappear(page)
     */
    static async waitForToastDisappear(
        page: Page,
        selector: string = '.toast, .alert',
        timeout: number = 10000
    ) {
        await page.waitForSelector(selector, { state: 'hidden', timeout }).catch(() => { });
    }

    /**
     * Check if toast exists
     * @param page - Playwright Page
     * @param selector - Selector of toast
     * @returns true if exists, false if not
     * 
     * @example
     * const hasToast = await ToastHelper.hasToast(page)
     */
    static async hasToast(page: Page, selector: string = '.toast, .alert'): Promise<boolean> {
        return await this.countToasts(page, selector) > 0;
    }

    /**
     * Close toast
     * @param page - Playwright Page
     * @param closeButtonSelector - Selector of close button
     * 
     * @example
     * await ToastHelper.closeToast(page)
     */
    static async closeToast(page: Page, closeButtonSelector: string = '.toast .close, .alert .close') {
        const btn = page.locator(closeButtonSelector);
        await btn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        await btn.click();
    }

    /**
     * Click action button in toast (e.g., "Undo", "View")
     * @param page - Playwright Page
     * @param buttonText - Text on the button
     * 
     * @example
     * await ToastHelper.clickToastAction(page, 'Undo')
     * await ToastHelper.clickToastAction(page, /view|view/i)
     */
    static async clickToastAction(page: Page, buttonText: string | RegExp) {
        const el = page.locator('.toast, .alert').first();
        const btn = el.getByRole('button', { name: buttonText });
        await btn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        await btn.click();
    }

    /**
     * Get text from toast
     * @param page - Playwright Page
     * @param selector - Selector of toast
     * @returns toast message
     * 
     * @example
     * const message = await ToastHelper.getToastMessage(page)
     */
    static async getToastMessage(page: Page, selector: string = '.toast, .alert'): Promise<string> {
        const el = page.locator(selector).first();
        await el.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        return await el.textContent() || '';
    }

    /**
     * Count number of displayed toasts
     * @param page - Playwright Page
     * @param selector - Selector of toast
     * @returns number of toasts
     * 
     * @example
     * const count = await ToastHelper.countToasts(page)
     */
    static async countToasts(page: Page, selector: string = '.toast, .alert'): Promise<number> {
        return await page.locator(selector).count();
    }

    // ===== 🔥 NEW: Advanced Features (Tier A) =====

    /**
     * 🔥 Wait for toast to appear
     * @param page - Playwright Page
     * @param options - Wait options
     * 
     * @example
     * await ToastHelper.waitForToast(page, { type: 'success', timeout: 5000 })
     * await ToastHelper.waitForToast(page, { message: 'Saved', timeout: 3000 })
     */
    static async waitForToast(
        page: Page,
        options: {
            /** Toast type */
            type?: 'success' | 'error' | 'warning' | 'info';
            /** Expected message */
            message?: string | RegExp;
            /** Custom selector */
            selector?: string;
            /** Timeout (ms) */
            timeout?: number;
        } = {}
    ): Promise<void> {
        const { type, message, selector, timeout = 5000 } = options;

        let toastSelector = selector || this.TOAST_SELECTORS;

        if (type) {
            switch (type) {
                case 'success':
                    toastSelector = this.SUCCESS_SELECTORS;
                    break;
                case 'error':
                    toastSelector = this.ERROR_SELECTORS;
                    break;
                case 'warning':
                    toastSelector = this.WARNING_SELECTORS;
                    break;
                case 'info':
                    toastSelector = this.INFO_SELECTORS;
                    break;
            }
        }

        const el = page.locator(toastSelector);

        if (message) {
            await el.filter({ hasText: message }).waitFor({ state: 'visible', timeout });
        } else {
            await el.first().waitFor({ state: 'visible', timeout });
        }
    }

    /**
     * 🔥 Verify toast position
     * @param page - Playwright Page
     * @param expectedPosition - Expected position
     * @param selector - Selector of toast container
     * 
     * @example
     * await ToastHelper.verifyToastPosition(page, 'top-left')
     * await ToastHelper.verifyToastPosition(page, 'bottom-center')
     */
    static async verifyToastPosition(
        page: Page,
        expectedPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right',
        selector: string = '.toast-container, [class*="toast-container"]'
    ): Promise<void> {
        const container = page.locator(selector).first();
        await container.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });

        const className = await container.getAttribute('class') || '';
        const positionClass = expectedPosition.replace('-', '_');

        if (!className.includes(expectedPosition) && !className.includes(positionClass)) {
            throw new Error(`Toast position should be '${expectedPosition}', but got class: ${className}`);
        }
    }

    /**
     * 🔥 Verify toast display duration
     * @param page - Playwright Page
     * @param expectedDuration - Expected duration (ms)
     * @param tolerance - Acceptable tolerance (ms)
     * 
     * @example
     * await ToastHelper.verifyToastDuration(page, 3000, 500)
     */
    static async verifyToastDuration(
        page: Page,
        expectedDuration: number,
        tolerance: number = 500
    ): Promise<void> {
        const startTime = Date.now();
        await this.waitForToast(page);
        await this.waitForToastDisappear(page, '.toast, .alert', expectedDuration + tolerance + 1000);
        const actualDuration = Date.now() - startTime;

        const minDuration = expectedDuration - tolerance;
        const maxDuration = expectedDuration + tolerance;

        if (actualDuration < minDuration || actualDuration > maxDuration) {
            throw new Error(
                `Toast duration should be ${expectedDuration}ms (±${tolerance}ms), but was ${actualDuration}ms`
            );
        }
    }

    /**
     * 🔥 Verify multiple toasts simultaneously
     * @param page - Playwright Page
     * @param expectedMessages - Array of expected messages
     * @param options - Options
     * 
     * @example
     * await ToastHelper.verifyMultipleToasts(page, ['Saved', 'Updated', 'Deleted'])
     */
    static async verifyMultipleToasts(
        page: Page,
        expectedMessages: (string | RegExp)[],
        options: {
            /** Whether to check order */
            checkOrder?: boolean;
            /** Timeout (ms) */
            timeout?: number;
        } = {}
    ): Promise<void> {
        const { checkOrder = false, timeout = 5000 } = options;

        const toasts = page.locator(this.TOAST_SELECTORS);
        await toasts.first().waitFor({ state: 'visible', timeout });

        const count = await toasts.count();

        if (count < expectedMessages.length) {
            throw new Error(
                `Expected ${expectedMessages.length} toasts, but found only ${count}`
            );
        }

        if (checkOrder) {
            for (let i = 0; i < expectedMessages.length; i++) {
                const toast = toasts.nth(i);
                await expect(toast).toContainText(expectedMessages[i]);
            }
        } else {
            const allTexts = await toasts.allTextContents();
            for (const expectedMsg of expectedMessages) {
                const found = allTexts.some(text => {
                    if (typeof expectedMsg === 'string') {
                        return text.includes(expectedMsg);
                    } else {
                        return expectedMsg.test(text);
                    }
                });

                if (!found) {
                    throw new Error(`Expected toast message '${expectedMsg}' not found in: ${allTexts.join(', ')}`);
                }
            }
        }
    }

    /**
     * 🔥 Verify toast icon
     * @param page - Playwright Page
     * @param expectedIcon - Expected icon
     * @param selector - Selector of toast
     * 
     * @example
     * await ToastHelper.verifyToastIcon(page, 'success')
     * await ToastHelper.verifyToastIcon(page, 'error')
     */
    static async verifyToastIcon(
        page: Page,
        expectedIcon: 'success' | 'error' | 'warning' | 'info',
        selector?: string
    ): Promise<void> {
        const toastSelector = selector || this.TOAST_SELECTORS;
        const toast = page.locator(toastSelector).first();
        await toast.waitFor({ state: 'visible', timeout: 5000 });

        const iconSelectors = [
            `[class*="icon-${expectedIcon}"]`,
            `[class*="${expectedIcon}-icon"]`,
            `.icon.${expectedIcon}`,
            `svg[class*="${expectedIcon}"]`
        ];

        let iconFound = false;
        for (const iconSel of iconSelectors) {
            const icon = toast.locator(iconSel);
            if (await icon.count() > 0) {
                iconFound = true;
                break;
            }
        }

        if (!iconFound) {
            throw new Error(`Toast should have '${expectedIcon}' icon, but icon not found`);
        }
    }

    /**
     * 🔥 Get all toast data
     * @param page - Playwright Page
     * @param selector - Selector of toast
     * @returns Toast info object
     * 
     * @example
     * const info = await ToastHelper.getToastInfo(page)
     * console.log(info.message, info.type)
     */
    static async getToastInfo(
        page: Page,
        selector: string = '.toast, .alert'
    ): Promise<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info' | 'unknown';
        visible: boolean;
        hasCloseButton: boolean;
    }> {
        const toast = page.locator(selector).first();
        const visible = await toast.isVisible().catch(() => false);

        if (!visible) {
            return {
                message: '',
                type: 'unknown',
                visible: false,
                hasCloseButton: false
            };
        }

        const message = await toast.textContent() || '';
        const className = await toast.getAttribute('class') || '';

        let type: 'success' | 'error' | 'warning' | 'info' | 'unknown' = 'unknown';
        if (className.includes('success')) type = 'success';
        else if (className.includes('error') || className.includes('danger')) type = 'error';
        else if (className.includes('warning')) type = 'warning';
        else if (className.includes('info')) type = 'info';

        const closeButton = toast.locator(this.CLOSE_SELECTORS);
        const hasCloseButton = await closeButton.count() > 0;

        return { message, type, visible, hasCloseButton };
    }

    /**
     * 🔥 Close all toasts
     * @param page - Playwright Page
     * @param selector - Selector of toast
     * 
     * @example
     * await ToastHelper.closeAllToasts(page)
     */
    static async closeAllToasts(page: Page, selector: string = '.toast, .alert'): Promise<void> {
        const toasts = page.locator(selector);
        const count = await toasts.count();

        for (let i = 0; i < count; i++) {
            const toast = toasts.nth(i);
            const closeBtn = toast.locator(this.CLOSE_SELECTORS);

            if (await closeBtn.count() > 0) {
                await closeBtn.click().catch(() => { });
                await page.waitForTimeout(100);
            }
        }
    }
}

// ===== Usage Examples =====

// Variant 1: Verify success toast
/*
import { ToastHelper } from './webUiDialog.template';

await ToastHelper.verifySuccess(page, 'Saved successfully');
*/

// Variant 2: Verify error toast
/*
await ToastHelper.verifyError(page, 'Failed to save');
*/

// Variant 3: Verify warning/info toast
/*
await ToastHelper.verifyWarning(page, 'Please check your input');
await ToastHelper.verifyInfo(page, 'Processing...');
*/

// Variant 4: Wait for toast to disappear
/*
await ToastHelper.waitForToastDisappear(page);
*/

// Variant 5: Check if toast exists
/*
const hasToast = await ToastHelper.hasToast(page);
if (hasToast) {
  await ToastHelper.closeToast(page);
}
*/

// Variant 6: Use custom selector
/*
await ToastHelper.verifySuccess(page, 'Success!', '.custom-toast.success');
*/

// Variant 7: Click action button in toast
/*
await ToastHelper.clickToastAction(page, 'Undo');
await ToastHelper.clickToastAction(page, /view|view/i);
*/

// Variant 8: Get text from toast
/*
const message = await ToastHelper.getToastMessage(page);
console.log(message);
*/

// Variant 9: Count toasts
/*
const count = await ToastHelper.countToasts(page);
if (count > 1) {
  // Multiple toasts
}
*/

// ===== NEW VARIANTS (Tier A) =====

// Variant 10: Wait for toast to appear (specify type)
/*
await ToastHelper.waitForToast(page, { type: 'success', timeout: 5000 });
await ToastHelper.waitForToast(page, { type: 'error', message: 'Failed' });
*/

// Variant 11: Verify toast position
/*
await ToastHelper.verifyToastPosition(page, 'top-right');
await ToastHelper.verifyToastPosition(page, 'bottom-center');
*/

// Variant 12: Verify toast display duration
/*
await ToastHelper.verifyToastDuration(page, 3000, 500); // 3s ±500ms
*/

// Variant 13: Verify multiple toasts simultaneously
/*
await ToastHelper.verifyMultipleToasts(page, ['Saved', 'Updated', 'Deleted']);
await ToastHelper.verifyMultipleToasts(page, ['Success', 'Warning'], { checkOrder: true });
*/

// Variant 14: Verify toast icon
/*
await ToastHelper.verifyToastIcon(page, 'success');
await ToastHelper.verifyToastIcon(page, 'error');
*/

// Variant 15: Get all toast data
/*
const info = await ToastHelper.getToastInfo(page);
console.log(`Type: ${info.type}, Message: ${info.message}`);
if (info.hasCloseButton) {
  await ToastHelper.closeToast(page);
}
*/

// Variant 16: Close all toasts
/*
await ToastHelper.closeAllToasts(page);
*/

// Variant 17: Combo - Verify and Wait
/*
await ToastHelper.waitForToast(page, { type: 'success', message: 'Saved' });
await ToastHelper.verifyToastIcon(page, 'success');
await ToastHelper.verifyToastPosition(page, 'top-right');
await ToastHelper.waitForToastDisappear(page);
*/
