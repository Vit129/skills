// Template: Drawer / Sub-panel Helper
// Category: Drawer
// Usage: await DrawerHelper.waitForOpen(page)

import { Page, expect } from '@playwright/test';

interface DrawerConfig {
    panelSelector?: string;
    closeButtonSelector?: string;
    overlaySelector?: string;
}

/**
 * DrawerHelper - Static utility class for managing Drawer / Sub-panel
 * Supports open, close, close by overlay, and verifying state
 *
 * ✅ FEATURES:
 * - Wait for drawer open/close (waitForOpen, waitForClose)
 * - Close drawer (closeByButton, closeByOverlay)
 * - Verify state (isOpen, isClosed)
 *
 * @example
 * await DrawerHelper.waitForOpen(page)
 * await DrawerHelper.closeByButton(page)
 */
export class DrawerHelper {
    private static readonly PANEL = '[data-testid="drawer-panel"]';
    private static readonly CLOSE_BTN = '[data-testid="drawer-close"]';
    private static readonly OVERLAY = '[data-testid="drawer-overlay"]';

    /**
     * Wait for drawer to open
     */
    static async waitForOpen(page: Page, config?: DrawerConfig): Promise<void> {
        const selector = config?.panelSelector || this.PANEL;
        await expect(page.locator(selector)).toBeVisible();
    }

    /**
     * Wait for drawer to close
     */
    static async waitForClose(page: Page, config?: DrawerConfig): Promise<void> {
        const selector = config?.panelSelector || this.PANEL;
        await expect(page.locator(selector)).toBeHidden();
    }

    /**
     * Close drawer using Close button
     */
    static async closeByButton(page: Page, config?: DrawerConfig): Promise<void> {
        const closeBtn = config?.closeButtonSelector || this.CLOSE_BTN;
        const panel = config?.panelSelector || this.PANEL;
        await page.locator(closeBtn).click();
        await expect(page.locator(panel)).toBeHidden();
    }

    /**
     * Close drawer by clicking overlay
     */
    static async closeByOverlay(page: Page, config?: DrawerConfig): Promise<void> {
        const overlay = config?.overlaySelector || this.OVERLAY;
        const panel = config?.panelSelector || this.PANEL;
        await page.locator(overlay).click();
        await expect(page.locator(panel)).toBeHidden();
    }

    /**
     * Verify drawer is open
     */
    static async isOpen(page: Page, config?: DrawerConfig): Promise<boolean> {
        const selector = config?.panelSelector || this.PANEL;
        return await page.locator(selector).isVisible();
    }
}

/*
// ===== Usage Examples =====

import { DrawerHelper } from './webUiDrawer.template';

// Variant 1: Wait for drawer open
await DrawerHelper.waitForOpen(page);

// Variant 2: Close by button
await DrawerHelper.closeByButton(page);

// Variant 3: Close by overlay
await DrawerHelper.closeByOverlay(page);

// Variant 4: Verify state
const open = await DrawerHelper.isOpen(page);

// Variant 5: Custom selectors
await DrawerHelper.waitForOpen(page, { panelSelector: '.side-panel' });
*/
