// import {test, expect} from '@playwright/test';

// test.describe('Login Tests', () => {

//     test('login test', async ({page}) => {
//     await page.goto('https://qa03.stage.chairlyo.com/login');

//     // Fill in the username and password fields
//     await page.getByLabel('Email*').fill('skilladmin@test.com');
//     await page.locator('[name="password"]').fill('Skill@123');

//     // Click the login button
//     await page.getByRole('button', { name: 'Log in' }).click();
//     // Expect to be redirected to the dashboard page
//     await expect(page).toHaveURL('https://qa03.stage.chairlyo.com/');

//     // Expect the logged-in user to be visible in the sidebar
//     await expect(page.getByText('skilladmin@test.com')).toBeVisible();

//     // Expect a success toast to be visible
//     await expect(page.getByText('Success', { exact: true })).toBeVisible();
//     await expect(page.getByText('Login successful!')).toBeVisible();
//     });

// });

import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

// test.describe('Login Tests', () => {

//   test('Login with valid credentials', async ({ page }) => {

//     const loginPage = new LoginPage(page);

//     const email = 'skilladmin@test.com';
//     const password = 'Skill@123';

//     await loginPage.goto();
//     await loginPage.login(email, password);
//     await loginPage.verifySuccessfulLogin();

//   });

// });

test.describe('Login Test', () => {
  let loginPage : LoginPage;
 
 const email =process.env.ORG_ADMIN_EMAIL as string;
 const password = process.env.ORG_ADMIN_PASSWORD as string;
 const url= process.env.BASE_URL as string;
 
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto(url);
  });
 
 
  test('Login to Chairlyo with valid credentials', async ({ page }) => {
    await loginPage.login(email, password);
    await loginPage.verifySuccessfulLogin(url, email);
  });
});