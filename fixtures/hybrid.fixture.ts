import { test as apiTest } from './api.fixture';
import { LoginPage } from '../pages/login.page';
import { BranchPage } from '../pages/branch.page';
import { BranchData, BranchUpdateData, generateBranchData, generateBranchUpdateData } from './branch-data';

interface HybridFixtures {
  branchPage: BranchPage;
  branchData: BranchData;
  branchUpdateData: BranchUpdateData;
}

const baseUrl = process.env.BASE_URL as string;

export const test = apiTest.extend<HybridFixtures>({
  // Authenticates the browser via the API session instead of the UI login form, so the
  // form itself stays dedicated test coverage (see login.spec.ts) rather than reused setup.
  branchPage: async ({ page, apiSession }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginViaApi(apiSession, `${baseUrl}/`);
    await loginPage.verifyAuthenticatedSession(`${baseUrl}/`, apiSession.user.email);

    await use(new BranchPage(page));
  },

  branchData: async ({}, use) => {
    await use(generateBranchData());
  },

  branchUpdateData: async ({}, use) => {
    await use(generateBranchUpdateData());
  },
});

export { expect } from '@playwright/test';
