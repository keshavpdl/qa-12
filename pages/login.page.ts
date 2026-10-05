import { Page, expect } from '@playwright/test';
import { loginLocators, LoginLocators } from '../locators/login.locator';
import { LoginResponse } from '../api/types/auth.types';

export class LoginPage {
  readonly page: Page;
  readonly locators: LoginLocators;

  constructor(page: Page) {
    this.page = page;
    this.locators = loginLocators(page);
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async login(email: string, password: string) {
    await this.locators.emailInput.fill(email);
    await this.locators.passwordInput.fill(password);
    await this.locators.loginButton.click();
  }

  // Seeds the app's persisted `auth-storage` before any page script runs, so the SPA boots
  // already authenticated from an API login response instead of submitting the login form.
  async loginViaApi(session: LoginResponse, redirectUrl: string) {
    await this.page.addInitScript((session) => {
      window.localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            user: session.user,
            isAuthenticated: true,
            accessToken: session.access,
            refreshToken: session.refresh,
            renewalAccessToken: null,
            renewalRefreshToken: null,
            branch: session.branch,
            branches: session.branches,
            roleInfo: session.role_info,
            organization: session.organization,
          },
          version: 0,
        }),
      );
    }, session);

    await this.page.goto(redirectUrl);
  }

  async verifySuccessfulLogin(url: string, email: string) {
    await expect(this.page).toHaveURL(url);
    await expect(this.locators.loggedInUser(email)).toBeVisible();
    await expect(this.locators.successToast).toBeVisible();
    await expect(this.locators.successMessage).toBeVisible();
  }

  async verifyAuthenticatedSession(url: string, email: string) {
    await expect(this.page).toHaveURL(url);
    await expect(this.locators.loggedInUser(email)).toBeVisible();
  }
}