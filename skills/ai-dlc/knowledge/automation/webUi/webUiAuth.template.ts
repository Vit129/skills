// Template: Login Page Object (Azure AD)
// Category: Page Object
// Usage: await loginPage.login('user@company.com', 'password123')

import { Page, expect } from '@playwright/test';

/**
 * LoginPage - Page Object for Login page
 * Supports: Standard Login, Microsoft Azure AD, 2FA
 * 
 * ✅ SUPPORTED LOGIN TYPES:
 * - Microsoft Azure AD (OAuth 2.0)
 * - Standard Login (username/password)
 * - 2FA (manual OTP input)
 * 
 * ✅ FEATURES:
 * - Login with auto-detect Azure AD (login)
 * - Login with custom selectors (loginWithAzureAdCustom)
 * - Wait for 2FA (handleAzure2fa)
 * - Verify login success (verifyLoginSuccess)
 * 
 * @example
 * // Login with Azure AD
 * const loginPage = new LoginPage(page)
 * await loginPage.goto('https://example.com')
 * await loginPage.login('user@company.com', 'pass')
 */
export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to Login page
     * @param baseUrl - System Base URL
     * @param path - Login page path (default: /login)
     * 
     * @example
     * await loginPage.goto('https://example.com')
     * await loginPage.goto('https://example.com', '/auth/login')
     */
    async goto(baseUrl: string, path: string = '/login') {
        await this.page.goto(`${baseUrl}${path}`);
        await this.page.waitForLoadState('networkidle').catch(() => { });
    }

    /**
     * 🔥 MAIN: Login to system using Microsoft Azure AD (Default)
     * @param email - Email for Microsoft account
     * @param password - Password
     * @param options - Login options
     * 
     * @example
     * // Basic login
     * await loginPage.login('user@company.com', 'password123')
     * 
     * // Login with options
     * await loginPage.login('user@company.com', 'pass', { staySignedIn: true })
     */
    async login(
        email: string,
        password: string,
        options: {
            /** Stay signed in? (default: false = No) */
            staySignedIn?: boolean;
            /** Wait for manual 2FA input (default: false) */
            waitFor2fa?: boolean;
            /** Timeout for 2FA (ms, default: 60000) */
            mfaTimeout?: number;
            /** Login button text (if in Thai) */
            loginButtonText?: string;
        } = {}
    ) {
        await this.loginWithAzureAd(email, password, options);
    }

    /**
     * Verify Login Success
     * @param expectedUrl - Expected URL pattern (default: /dashboard|home/)
     * 
     * @example
     * await loginPage.verifyLoginSuccess()
     * await loginPage.verifyLoginSuccess(/profile|main/)
     */
    async verifyLoginSuccess(expectedUrl: RegExp = /dashboard|home/) {
        await expect(this.page).toHaveURL(expectedUrl);
    }

    /**
     * Login with Microsoft Azure AD (OAuth)
     * @param email - Email for Microsoft account
     * @param password - Password
     * @param options - Login options
     * 
     * @example
     * await loginPage.loginWithAzureAd('user@company.com', 'pass')
     * await loginPage.loginWithAzureAd('user@company.com', 'pass', {
     *   waitFor2fa: true,
     *   mfaTimeout: 60000
     * })
     */
    async loginWithAzureAd(
        email: string,
        password: string,
        options: {
            /** Stay signed in? (default: false = No) */
            staySignedIn?: boolean;
            /** Wait for manual 2FA input (default: false) */
            waitFor2fa?: boolean;
            /** Timeout for 2FA (ms, default: 60000) */
            mfaTimeout?: number;
            /** Login button text (if in Thai) */
            loginButtonText?: string;
        } = {}
    ) {
        const { staySignedIn = false, waitFor2fa = false, mfaTimeout = 60000, loginButtonText } = options;

        if (loginButtonText) {
            const btn = this.page.getByRole('button', { name: loginButtonText });
            await btn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
            await btn.click();
        }

        const emailInput = this.page.getByRole('textbox', { name: /Enter email|Email|Email/i });
        await emailInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        await emailInput.fill(email);

        const nextBtn = this.page.getByRole('button', { name: /Sign in|sign in|next/i });
        await nextBtn.click();

        await this.page.waitForURL(/login\.microsoftonline\.com/, { timeout: 10000 }).catch(() => { });
        await this.page.waitForSelector('input[type="password"]', { timeout: 10000 }).catch(() => { });

        const passwordInput = this.page.getByRole('textbox', { name: /password|enter the password/i });
        await passwordInput.fill(password);

        const signInBtn = this.page.getByRole('button', { name: /sign in/i });
        await signInBtn.click();

        if (waitFor2fa) {
            await this.handleAzure2fa(mfaTimeout);
        }

        const stayNoBtn = this.page.getByRole('button', { name: 'No' });
        const stayYesBtn = this.page.getByRole('button', { name: 'Yes' });

        if (await stayNoBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            if (staySignedIn) {
                await stayYesBtn.click();
            } else {
                await stayNoBtn.click();
            }
        }
    }

    /**
     * Login with Microsoft Azure AD using custom selectors
     * @param email - Email
     * @param password - Password
     * @param config - Azure AD selectors config
     * @param options - Login options
     */
    async loginWithAzureAdCustom(
        email: string,
        password: string,
        config: {
            emailSelector?: string;
            passwordSelector?: string;
            nextButtonSelector?: string;
            submitButtonSelector?: string;
            stayYesSelector?: string;
            stayNoSelector?: string;
        } = {},
        options: {
            staySignedIn?: boolean;
            waitFor2fa?: boolean;
            mfaTimeout?: number;
        } = {}
    ) {
        const { staySignedIn = false, waitFor2fa = false, mfaTimeout = 60000 } = options;
        const emailSel = config.emailSelector || 'input[type="email"]';
        const passwordSel = config.passwordSelector || 'input[type="password"]';
        const nextBtn = config.nextButtonSelector || 'input[type="submit"]';
        const submitBtn = config.submitButtonSelector || 'input[type="submit"]';
        const stayYes = config.stayYesSelector || 'input[type="submit"][value="Yes"]';
        const stayNo = config.stayNoSelector || 'input[type="submit"][value="No"]';

        const emailEl = this.page.locator(emailSel);
        await emailEl.fill(email);
        await this.page.locator(nextBtn).click();

        await this.page.waitForSelector(passwordSel, { timeout: 10000 }).catch(() => { });
        const passwordEl = this.page.locator(passwordSel);
        await passwordEl.fill(password);
        await this.page.locator(submitBtn).click();

        if (waitFor2fa) {
            await this.handleAzure2fa(mfaTimeout);
        }

        const stayYesBtn = this.page.locator(stayYes);
        if (await stayYesBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            if (staySignedIn) {
                await stayYesBtn.click();
            } else {
                await this.page.locator(stayNo).click();
            }
        }
    }

    /**
     * Handle Azure AD 2FA (Wait for manual OTP input)
     * @param timeout - Timeout (ms)
     */
    private async handleAzure2fa(timeout: number = 60000) {
        try {
            await expect.poll(() => this.page.url(), { timeout }).not.toMatch(/login\.microsoftonline\.com|login\.live\.com/);
        } catch (err) {
            throw new Error(`2FA timeout after ${timeout}ms. Please complete 2FA manually.`);
        }
    }
}

// ===== Usage Examples =====

// Variant 1: Basic Login (Stay signed in = No)
/*
import { test } from '@playwright/test';
import { LoginPage } from './webUiAuth.template';

test('Login with Azure AD', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto('url');
  await loginPage.login(
    'email',
    'password'
  );
  await loginPage.verifyLoginSuccess(/profile/);
});
*/

// Variant 2: Login with initial button click
/*
await loginPage.goto('https://example.com');
await loginPage.login('user@company.com', 'password123', {
  loginButtonText: 'Sign In'
});
*/

// Variant 3: Login + Stay signed in = Yes
/*
await loginPage.login('user@company.com', 'password123', {
  staySignedIn: true
});
*/

// Variant 4: Login + 2FA (Wait for manual OTP)
/*
await loginPage.login('user@company.com', 'password123', {
  waitFor2fa: true,
  mfaTimeout: 60000  // Wait 60 seconds
});
// Wait for user to enter OTP in Microsoft Authenticator/SMS
*/

// Variant 5: Login + All options
/*
await loginPage.login('user@company.com', 'password123', {
  loginButtonText: 'Sign In',
  staySignedIn: false,
  waitFor2fa: true,
  mfaTimeout: 60000
});
*/

// Variant 6: Login with custom selectors (Advanced)
/*
await loginPage.loginWithAzureAdCustom(
  'user@company.com',
  'password123',
  {
    emailSelector: '#i0116',
    passwordSelector: '#i0118',
    nextButtonSelector: '#idSIButton9',
    submitButtonSelector: '#idSIButton9',
    stayYesSelector: '#idSIButton9',
    stayNoSelector: '#idBtn_Back'
  },
  {
    staySignedIn: false,
    waitFor2fa: true
  }
);
*/

// Variant 7: Verify Login Success
/*
// Default pattern: /dashboard|home/
await loginPage.verifyLoginSuccess();

// Custom pattern
await loginPage.verifyLoginSuccess(/profile|main/);
*/
