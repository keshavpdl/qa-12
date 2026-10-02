import { Locator, Page } from '@playwright/test';

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

export interface LoginLocators {
  emailInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  loggedInUser: (email: string) => Locator;
  successToast: Locator;
  successMessage: Locator;
}

export const loginLocators = (page: Page): LoginLocators => ({
  emailInput: page.getByLabel('Email*'),
  passwordInput: page.locator('[name="password"]'),
  loginButton: page.getByRole('button', { name: 'Log in' }),

  loggedInUser: (email: string) => page.getByText(email),
  successToast: page.getByText('Success', { exact: true }),
  successMessage: page.getByText('Login successful!'),
});