import { Page, expect } from '@playwright/test';
import { loginLocators, LoginLocators } from '../locators/login.locator';

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

  async verifySuccessfulLogin(url: string, email: string) {
    await expect(this.page).toHaveURL(url);
    await expect(this.locators.loggedInUser(email)).toBeVisible();
    await expect(this.locators.successToast).toBeVisible();
    await expect(this.locators.successMessage).toBeVisible();
  }
}