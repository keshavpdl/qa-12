import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { BranchPage } from '../pages/branch.page';
import { BranchData, BranchUpdateData, generateBranchData, generateBranchUpdateData } from './branch-data';

interface BranchFixtures {
  branchPage: BranchPage;
  branchData: BranchData;
  branchUpdateData: BranchUpdateData;
}

const baseUrl = process.env.BASE_URL as string;
const orgAdminEmail = process.env.ORG_ADMIN_EMAIL as string;
const orgAdminPassword = process.env.ORG_ADMIN_PASSWORD as string;

export const test = base.extend<BranchFixtures>({
  branchPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto(`${baseUrl}/login`);
    await loginPage.login(orgAdminEmail, orgAdminPassword);
    await loginPage.verifySuccessfulLogin(`${baseUrl}/`, orgAdminEmail);

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
