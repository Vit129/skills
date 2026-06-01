// Template: App Launcher / 9Dot Helper
// Category: Navigation
// Usage: await AppLauncherHelper.navigateToApp(page)

import { Page, expect } from '@playwright/test';

/**
 * AppLauncherHelper - Static utility class for managing 9-Dot App Launcher
 * Supports open launcher, cross-app navigation, and verifying app list
 *
 * ✅ FEATURES:
 * - Open launcher (openLauncher)
 * - Navigate to app (navigateToApp)
 * - Verify app visible (verifyAppVisible)
 * - Close launcher (closeLauncher)
 *
 * @example
 * await AppLauncherHelper.navigateToApp(page)
 */
export class AppLauncherHelper {
    private static readonly NINE_DOT_BTN = '[data-testid="nine-dot-launcher"]';
    private static readonly APP_GRID = '[data-testid="app-grid"]';

    /**
     * Open App Launcher
     */
    static async openLauncher(page: Page): Promise<void> {
        await page.locator(this.NINE_DOT_BTN).click();
        await expect(page.locator(this.APP_GRID)).toBeVisible();
    }

    /**
     * Navigate to specific app
     * @param appName - Name of the app to navigate to
     */
    static async navigateToApp(page: Page, appName: string): Promise<void> {
        await this.openLauncher(page);
        await page.locator(this.APP_GRID).getByText(appName).click();
        await page.waitForURL(`**/${appName.toLowerCase().replace(/\s/g, '-')}**`);
    }

    /**
     * Verify app exists in launcher
     */
    static async verifyAppVisible(page: Page, appName: string): Promise<void> {
        await this.openLauncher(page);
        await expect(page.locator(this.APP_GRID).getByText(appName)).toBeVisible();
    }

    /**
     * Close launcher (Press Escape or click outside)
     */
    static async closeLauncher(page: Page): Promise<void> {
        await page.keyboard.press('Escape');
        await expect(page.locator(this.APP_GRID)).toBeHidden();
    }

    /**
     * Get all app names in launcher
     */
    static async getAppList(page: Page): Promise<string[]> {
        await this.openLauncher(page);
        const apps = await page.locator(this.APP_GRID).locator('[data-testid="app-item"]').allTextContents();
        return apps.map(a => a.trim()).filter(a => a.length > 0);
    }
}

/*
// ===== Usage Examples =====

import { AppLauncherHelper } from './webUiAppLauncher.template';

// Variant 1: Navigate to app
await AppLauncherHelper.navigateToApp(page);

// Variant 2: Verify app exists
await AppLauncherHelper.verifyAppVisible(page);

// Variant 3: Get all app names
const apps = await AppLauncherHelper.getAppList(page);

// Variant 4: Close launcher
await AppLauncherHelper.closeLauncher(page);
*/
