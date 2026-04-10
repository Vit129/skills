// Template: Card / Kanban Layout Helper
// Category: Card
// Usage: await CardListHelper.verifyCardExists(page, 'Title')

import { Page, expect } from '@playwright/test';

/**
 * CardListHelper - Static utility class for managing Card/Kanban Layout
 * Supports sorting, filtering, empty state, and card interaction
 *
 * ✅ FEATURES:
 * - Get card by title (getCardByTitle)
 * - Sort cards (sortBy)
 * - Verify card exists/not exists (verifyCardExists, verifyCardNotExists)
 * - Verify empty state (verifyEmptyState)
 * - Click card (clickCard)
 *
 * @example
 * await CardListHelper.verifyCardExists(page, 'Task Title')
 */
export class CardListHelper {
    private static readonly CARD_CONTAINER = '[data-testid="card-container"]';
    private static readonly SORT_BTN = '[data-testid="sort-btn"]';
    private static readonly EMPTY_STATE = '[data-testid="empty-state"]';

    /**
     * Get card element by title
     */
    static getCardByTitle(page: Page, title: string) {
        return page.locator(this.CARD_CONTAINER).filter({ hasText: title });
    }

    /**
     * Sort cards
     * @param order - 'new-to-old' | 'old-to-new'
     */
    static async sortBy(page: Page, order: 'new-to-old' | 'old-to-new'): Promise<void> {
        await page.locator(this.SORT_BTN).click();
        await page.getByTestId(`sort-${order}`).click();
    }

    /**
     * Verify card exists
     */
    static async verifyCardExists(page: Page, title: string): Promise<void> {
        await expect(this.getCardByTitle(page, title)).toBeVisible();
    }

    /**
     * Verify card does not exist
     */
    static async verifyCardNotExists(page: Page, title: string): Promise<void> {
        await expect(this.getCardByTitle(page, title)).toBeHidden();
    }

    /**
     * Verify empty state
     */
    static async verifyEmptyState(page: Page): Promise<void> {
        await expect(page.locator(this.EMPTY_STATE)).toBeVisible();
    }

    /**
     * Click card
     */
    static async clickCard(page: Page, title: string): Promise<void> {
        await this.getCardByTitle(page, title).click();
    }

    /**
     * Get card count
     */
    static async getCardCount(page: Page): Promise<number> {
        return await page.locator(this.CARD_CONTAINER).count();
    }
}

/*
// ===== Usage Examples =====

import { CardListHelper } from './webUiCard.template';

// Variant 1: Verify card exists
await CardListHelper.verifyCardExists(page, 'Task Title');

// Variant 2: Sort
await CardListHelper.sortBy(page, 'new-to-old');

// Variant 3: Empty state
await CardListHelper.verifyEmptyState(page);

// Variant 4: Click card
await CardListHelper.clickCard(page, 'Task Title');

// Variant 5: Get card count
const count = await CardListHelper.getCardCount(page);
*/
