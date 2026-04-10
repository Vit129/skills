// Template: OAuth 2.0 Login Helper
// Category: Auth
// Usage: await LoginHelper.getToken(request, url, username, password)

import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * LoginHelper - Class for managing OAuth 2.0 Login
 * Supports Password Grant, Client Credentials, Refresh Token
 * 
 * ✅ SUPPORTED GRANT TYPES:
 * - Password Grant: username + password
 * - Client Credentials: clientId + clientSecret
 * - Refresh Token: refresh existing token
 * 
 * ✅ FEATURES:
 * - Get access token (getToken)
 * - Get all tokens with expiry (getTokens)
 * - Refresh token (refresh)
 * - Basic auth encoding (encodeBasicAuth)
 * - Bearer header builder (bearerHeader)
 * 
 * @example
 * // Password Grant
 * const token = await LoginHelper.getToken(request, url, 'user', 'pass')
 * 
 * // Client Credentials
 * const token = await LoginHelper.getTokenClientCredentials(request, url, { clientId, clientSecret })
 */
export class LoginHelper {

  /**
   * Send OAuth2 token request (Low-level)
   * @param request - Playwright APIRequestContext
   * @param url - OAuth token endpoint URL
   * @param options - Token request options
   * @returns APIResponse
   */
  static async sendLoginRequest(
    request: APIRequestContext,
    url: string,
    options: {
      /** Grant type (default: 'password') */
      grantType?: 'password' | 'client_credentials' | 'refresh_token';
      /** Username (for password grant) */
      username?: string;
      /** Password (for password grant) */
      password?: string;
      /** Client ID */
      clientId?: string;
      /** Client Secret */
      clientSecret?: string;
      /** Basic Auth header (base64 encoded client credentials) */
      basicAuth?: string;
      /** Refresh Token (for refresh_token grant) */
      refreshToken?: string;
      /** Scope */
      scope?: string;
    }
  ): Promise<APIResponse> {
    const { basicAuth, ...rest } = options;

    const headers: any = { 'Content-Type': 'application/x-www-form-urlencoded' };
    if (basicAuth) {
      headers['Authorization'] = `Basic ${basicAuth}`;
    }

    const form = this.buildForm(rest);

    return await request.post(url, { headers, form });
  }

  /**
   * 🔥 MAIN: Login to system and fetch Access Token (Alias for loginWithAzureAd)
   * @param request - Playwright APIRequestContext
   * @param url - OAuth token endpoint URL
   * @param options - Login options
   */
  static async login(
    request: APIRequestContext,
    url: string,
    options: {
      username: string;
      password: string;
      clientId?: string;
      clientSecret?: string;
      scope?: string;
      basicAuth?: string;
    }
  ): Promise<string> {
    return this.loginWithAzureAd(request, url, options);
  }

  /**
   * Login with Microsoft Azure AD (OAuth 2.0 Password Grant)
   * @param request - Playwright APIRequestContext
   * @param url - OAuth token endpoint URL
   * @param options - Login options
   */
  static async loginWithAzureAd(
    request: APIRequestContext,
    url: string,
    options: {
      username: string;
      password: string;
      clientId?: string;
      clientSecret?: string;
      scope?: string;
      basicAuth?: string;
    }
  ): Promise<string> {
    const { username, password, clientId, clientSecret, scope, basicAuth } = options;
    const response = await this.sendLoginRequest(request, url, {
      grantType: 'password',
      username,
      password,
      clientId,
      clientSecret,
      scope,
      basicAuth
    });
    const body = await this.validateAndParse(response, 'Login', url);
    return this.extractToken(body, 'Login');
  }

  /**
   * Login and fetch both Access Token and Refresh Token
   */
  static async loginGetTokens(
    request: APIRequestContext,
    url: string,
    username: string,
    password: string,
    basicAuth?: string
  ): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number }> {
    const response = await this.sendLoginRequest(request, url, {
      grantType: 'password',
      username,
      password,
      basicAuth
    });
    const body = await this.validateAndParse(response, 'Login', url);

    return {
      accessToken: this.extractToken(body, 'Login'),
      refreshToken: body.refresh_token,
      expiresIn: body.expires_in
    };
  }

  /**
   * Refresh Access Token using Refresh Token
   */
  static async refreshToken(
    request: APIRequestContext,
    url: string,
    refreshToken: string,
    basicAuth?: string
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    const response = await this.sendLoginRequest(request, url, {
      grantType: 'refresh_token',
      refreshToken,
      basicAuth
    });
    const body = await this.validateAndParse(response, 'Token Refresh', url);

    return {
      accessToken: body.access_token,
      refreshToken: body.refresh_token
    };
  }

  /**
   * Login with Client Credentials Grant
   */
  static async loginWithClientCredentials(
    request: APIRequestContext,
    url: string,
    options: { clientId?: string; clientSecret?: string; basicAuth?: string; scope?: string }
  ): Promise<string> {
    const response = await this.sendLoginRequest(request, url, {
      grantType: 'client_credentials',
      ...options
    });
    const body = await this.validateAndParse(response, 'Client Credentials', url);
    return this.extractToken(body, 'Client Credentials');
  }

  /**
   * Create Basic Auth header from clientId and clientSecret
   */
  static encodeBasicAuth(clientId: string, clientSecret: string): string {
    return Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  }

  /**
   * Create Bearer Authorization header
   */
  static bearerHeader(token: string): { Authorization: string } {
    return { Authorization: `Bearer ${token}` };
  }

  // ===== 🔥 P1: Auto Refresh Token =====

  /**
   * 🔥 Check and automatically refresh token if expired
   * @param request - Playwright APIRequestContext
   * @param url - OAuth token endpoint URL
   * @param options - Token options
   * @returns Valid access token
   * 
   * @example
   * const validToken = await LoginHelper.getValidToken(request, url, {
   *   accessToken: currentToken,
   *   refreshToken: refreshToken,
   *   expiresAt: tokenExpiresAt
   * });
   */
  static async getValidToken(
    request: APIRequestContext,
    url: string,
    options: {
      /** Current access token */
      accessToken: string;
      /** Refresh token */
      refreshToken: string;
      /** Token expiry timestamp (ms) */
      expiresAt: number;
      /** Buffer time before expiry (ms) (default: 60000 = 1 min) */
      bufferTime?: number;
      /** Basic auth for refresh */
      basicAuth?: string;
    }
  ): Promise<string> {
    const { accessToken, refreshToken, expiresAt, bufferTime = 60000, basicAuth } = options;

    // Check if token is near expiration
    const now = Date.now();
    const isExpiringSoon = (expiresAt - now) < bufferTime;

    if (!isExpiringSoon) {
      return accessToken;
    }

    // Refresh token
    const result = await this.refreshToken(request, url, refreshToken, basicAuth);
    return result.accessToken;
  }

  // ===== 🔥 P1: SSO Login =====

  /**
   * 🔥 Login with SSO (Azure AD, Google, Okta, etc.)
   * @param request - Playwright APIRequestContext
   * @param options - SSO options
   * @returns Access token
   * 
   * @example
   * const token = await LoginHelper.loginSso(request, {
   *   provider: 'azure',
   *   tokenUrl: 'https://login.microsoftonline.com/tenant/oauth2/v2.0/token',
   *   clientId: 'xxx',
   *   clientSecret: 'xxx',
   *   scope: 'openid profile email'
   * });
   */
  static async loginSso(
    request: APIRequestContext,
    options: {
      /** SSO provider (azure, google, okta, custom) */
      provider: 'azure' | 'google' | 'okta' | 'custom';
      /** Token endpoint URL */
      tokenUrl: string;
      /** Client ID */
      clientId: string;
      /** Client Secret */
      clientSecret: string;
      /** Scope */
      scope?: string;
      /** Username (for password grant) */
      username?: string;
      /** Password (for password grant) */
      password?: string;
    }
  ): Promise<string> {
    const { provider, tokenUrl, clientId, clientSecret, scope, username, password } = options;

    // If username/password exists, use password grant, otherwise use client credentials
    const grantType = username && password ? 'password' : 'client_credentials';

    const response = await this.sendLoginRequest(request, tokenUrl, {
      grantType,
      username,
      password,
      clientId,
      clientSecret,
      scope: scope || this.getDefaultScope(provider)
    });

    const body = await this.validateAndParse(response, `SSO Login (${provider})`, tokenUrl);
    return this.extractToken(body, `SSO Login (${provider})`);
  }

  /**
   * Login with Azure AD SSO
   */
  static async loginAzureSso(
    request: APIRequestContext,
    options: {
      tenantId: string;
      clientId: string;
      clientSecret: string;
      username?: string;
      password?: string;
      scope?: string;
    }
  ): Promise<string> {
    const { tenantId, ...rest } = options;
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    return this.loginSso(request, {
      provider: 'azure',
      tokenUrl,
      ...rest
    });
  }

  /**
   * Login with Google SSO
   */
  static async loginGoogleSso(
    request: APIRequestContext,
    options: {
      clientId: string;
      clientSecret: string;
      scope?: string;
    }
  ): Promise<string> {
    return this.loginSso(request, {
      provider: 'google',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      ...options
    });
  }

  /**
   * Login with Okta SSO
   */
  static async loginOktaSso(
    request: APIRequestContext,
    options: {
      domain: string;
      clientId: string;
      clientSecret: string;
      username?: string;
      password?: string;
      scope?: string;
    }
  ): Promise<string> {
    const { domain, ...rest } = options;
    const tokenUrl = `https://${domain}/oauth2/default/v1/token`;

    return this.loginSso(request, {
      provider: 'okta',
      tokenUrl,
      ...rest
    });
  }

  // ===== 🔥 P1: Token Validation =====

  /**
   * 🔥 Check if token is still valid (Token Introspection)
   * @param request - Playwright APIRequestContext
   * @param introspectUrl - Token introspection endpoint
   * @param token - Access token to check
   * @param clientCredentials - Client credentials for introspection
   * @returns true if token is still valid
   * 
   * @example
   * const isValid = await LoginHelper.validateToken(request, introspectUrl, token, {
   *   clientId: 'xxx',
   *   clientSecret: 'xxx'
   * });
   */
  static async validateToken(
    request: APIRequestContext,
    introspectUrl: string,
    token: string,
    clientCredentials?: { clientId: string; clientSecret: string }
  ): Promise<boolean> {
    const headers: any = { 'Content-Type': 'application/x-www-form-urlencoded' };

    if (clientCredentials) {
      const basicAuth = this.encodeBasicAuth(clientCredentials.clientId, clientCredentials.clientSecret);
      headers['Authorization'] = `Basic ${basicAuth}`;
    }

    const response = await request.post(introspectUrl, {
      headers,
      form: { token }
    });

    if (!response.ok()) {
      return false;
    }

    const body = await response.json();
    return body.active === true;
  }

  /**
   * Check if token is expired based on expiresAt
   */
  static isTokenExpired(expiresAt: number, bufferTime: number = 60000): boolean {
    const now = Date.now();
    return (expiresAt - now) < bufferTime;
  }

  /**
   * Calculate expiresAt from expiresIn (seconds)
   */
  static calculateExpiresAt(expiresIn: number): number {
    return Date.now() + (expiresIn * 1000);
  }

  // ===== 🔥 P1: Logout & Revoke =====

  /**
   * 🔥 Logout and revoke token
   * @param request - Playwright APIRequestContext
   * @param revokeUrl - Token revocation endpoint
   * @param token - Access token to revoke
   * @param clientCredentials - Client credentials
   * 
   * @example
   * await LoginHelper.logout(request, revokeUrl, token, {
   *   clientId: 'xxx',
   *   clientSecret: 'xxx'
   * });
   */
  static async logout(
    request: APIRequestContext,
    revokeUrl: string,
    token: string,
    clientCredentials?: { clientId: string; clientSecret: string }
  ): Promise<void> {
    const headers: any = { 'Content-Type': 'application/x-www-form-urlencoded' };

    if (clientCredentials) {
      const basicAuth = this.encodeBasicAuth(clientCredentials.clientId, clientCredentials.clientSecret);
      headers['Authorization'] = `Basic ${basicAuth}`;
    }

    const response = await request.post(revokeUrl, {
      headers,
      form: { token }
    });

    if (!response.ok()) {
      throw new Error(`Token revocation failed: ${response.status()} ${response.statusText()}`);
    }
  }

  /**
   * Revoke refresh token
   */
  static async revokeRefreshToken(
    request: APIRequestContext,
    revokeUrl: string,
    refreshToken: string,
    clientCredentials?: { clientId: string; clientSecret: string }
  ): Promise<void> {
    await this.logout(request, revokeUrl, refreshToken, clientCredentials);
  }

  // ===== Private Helper Methods =====

  /**
   * Get default scope for SSO provider
   */
  private static getDefaultScope(provider: string): string {
    switch (provider) {
      case 'azure':
        return 'openid profile email';
      case 'google':
        return 'openid profile email';
      case 'okta':
        return 'openid profile email';
      default:
        return 'openid';
    }
  }


  // ===== Private Helper Methods =====

  /**
   * Validate response and parse JSON
   */
  private static async validateAndParse(
    response: APIResponse,
    context: string,
    url: string
  ): Promise<any> {
    if (!response.ok()) {
      const errorBody = await response.text();
      throw new Error(`${context} Failed! Status: ${response.status()}\nUrl: ${url}\nResponse: ${errorBody}`);
    }
    return await response.json();
  }

  /**
   * Extract and validate access_token
   */
  private static extractToken(body: any, context: string): string {
    if (!body.access_token) {
      throw new Error(`${context} Successful but no access_token found.\nResponse: ${JSON.stringify(body)}`);
    }
    return body.access_token;
  }

  /**
   * Build form data based on grant type
   */
  private static buildForm(options: {
    grantType?: 'password' | 'client_credentials' | 'refresh_token';
    username?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    scope?: string;
  }): any {
    const { grantType = 'password', username, password, clientId, clientSecret, refreshToken, scope } = options;

    const form: any = { grant_type: grantType };

    // Always include client_id and client_secret if provided (required by Azure AD)
    if (clientId) form.client_id = clientId;
    if (clientSecret) form.client_secret = clientSecret;
    if (scope) form.scope = scope;

    if (grantType === 'password') {
      form.username = username;
      form.password = password;
    } else if (grantType === 'refresh_token') {
      form.refresh_token = refreshToken;
    }

    return form;
  }
}

// ===== Usage Examples =====

/*
import { LoginHelper } from './apiLoginOauth.template';

// Variant 1: Login (Alias for Azure AD)
const token = await LoginHelper.login(request, url, {
  username: 'user@example.com',
  password: 'password123'
});

// Variant 2: Login with Azure AD (Explicit)
const token = await LoginHelper.loginWithAzureAd(request, oauth.tokenUrl, {
  username: oauth.username,
  password: oauth.password,
  clientId: oauth.clientId,
  clientSecret: oauth.clientSecret,
  scope: oauth.scope
});

// Variant 3: With Basic Auth header
const basic = LoginHelper.encodeBasicAuth('clientId', 'secret');
const token = await LoginHelper.login(request, url, {
  username: 'user',
  password: 'pass',
  basicAuth: basic
});

// Variant 4: Login and get all tokens (with expiry)
const { accessToken, refreshToken, expiresIn } = await LoginHelper.loginGetTokens(
  request, url, 'user', 'pass'
);

// Variant 5: Refresh token
const { accessToken: newToken } = await LoginHelper.refreshToken(request, url, refreshToken);

// Variant 6: Client Credentials Grant
const token = await LoginHelper.loginWithClientCredentials(request, url, {
  clientId: 'id',
  clientSecret: 'secret',
  scope: 'api://default/.default'
});

// Variant 7: Use token with API
const response = await request.get(apiUrl, {
  headers: LoginHelper.bearerHeader(token)
});

// Variant 8: Full example with data from JSON
const oauth = testData.oauth;
const token = await LoginHelper.loginWithAzureAd(request, oauth.tokenUrl, {
  username: oauth.username,
  password: oauth.password,
  clientId: oauth.clientId,
  clientSecret: oauth.clientSecret,
  scope: oauth.scope
});

// Variant 9: Auto Refresh Token
const { accessToken, refreshToken, expiresIn } = await LoginHelper.loginGetTokens(request, url, 'user', 'pass');
const expiresAt = LoginHelper.calculateExpiresAt(expiresIn);

// Use token and auto refresh if near expiration
const validToken = await LoginHelper.getValidToken(request, url, {
  accessToken,
  refreshToken,
  expiresAt
});

// Variant 10: SSO Login - Azure AD
const azureToken = await LoginHelper.loginAzureSso(request, {
  tenantId: 'your-tenant-id',
  clientId: 'xxx',
  clientSecret: 'xxx',
  username: 'user@company.com',
  password: 'password'
});

// Variant 11: SSO Login - Google
const googleToken = await LoginHelper.loginGoogleSso(request, {
  clientId: 'xxx',
  clientSecret: 'xxx',
  scope: 'openid profile email'
});

// Variant 12: SSO Login - Okta
const oktaToken = await LoginHelper.loginOktaSso(request, {
  domain: 'your-domain.okta.com',
  clientId: 'xxx',
  clientSecret: 'xxx',
  username: 'user@company.com',
  password: 'password'
});

// Variant 13: Generic SSO Login
const ssoToken = await LoginHelper.loginSso(request, {
  provider: 'custom',
  tokenUrl: 'https://sso.company.com/oauth2/token',
  clientId: 'xxx',
  clientSecret: 'xxx',
  scope: 'api.read api.write'
});

// Variant 14: Token Validation
const isValid = await LoginHelper.validateToken(request, introspectUrl, token, {
  clientId: 'xxx',
  clientSecret: 'xxx'
});

if (!isValid) {
  throw new Error('Token is invalid or expired');
}

// Variant 15: Check Token Expiry
const expiresAt = LoginHelper.calculateExpiresAt(3600); // 1 hour
const isExpired = LoginHelper.isTokenExpired(expiresAt);

if (isExpired) {
  // Refresh token
  const newToken = await LoginHelper.refreshToken(request, url, refreshToken);
}

// Variant 16: Logout and Revoke Token
await LoginHelper.logout(request, revokeUrl, accessToken, {
  clientId: 'xxx',
  clientSecret: 'xxx'
});

// Variant 17: Revoke Refresh Token
await LoginHelper.revokeRefreshToken(request, revokeUrl, refreshToken, {
  clientId: 'xxx',
  clientSecret: 'xxx'
});

// Variant 18: Long-running Test with Auto Refresh
let currentToken = accessToken;
let currentRefreshToken = refreshToken;
let tokenExpiresAt = LoginHelper.calculateExpiresAt(expiresIn);

// Use in test loop
for (let i = 0; i < 100; i++) {
  currentToken = await LoginHelper.getValidToken(request, url, {
    accessToken: currentToken,
    refreshToken: currentRefreshToken,
    expiresAt: tokenExpiresAt
  });

  // Work with API
  const response = await request.get(apiUrl, {
    headers: LoginHelper.bearerHeader(currentToken)
  });
}
*/
