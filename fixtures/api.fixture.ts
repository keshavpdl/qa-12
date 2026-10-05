import { test as base } from '@playwright/test';
import { ApiClient } from '../api/client';
import { AuthService } from '../api/services/auth.service';
import { BranchService } from '../api/services/branch.service';
import { LoginResponse } from '../api/types/auth.types';
import { BranchPayload, BranchUpdatePayload } from '../api/types/branch.types';
import { generateBranchPayload, generateBranchUpdatePayload } from './api-branch-data';

interface ApiFixtures {
  apiClient: ApiClient;
  apiSession: LoginResponse;
  branchService: BranchService;
  branchPayload: BranchPayload;
  branchUpdatePayload: BranchUpdatePayload;
}

export const test = base.extend<ApiFixtures>({
  // A dedicated request context (rather than the ambient `request` fixture) keeps this
  // fixture bound to API_BASE_URL regardless of which project's baseURL (UI or API) is active,
  // so it authenticates correctly whether used standalone or merged into a UI test.
  apiClient: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({ baseURL: process.env.API_BASE_URL });

    await use(new ApiClient(apiContext));

    await apiContext.dispose();
  },

  // Exposes the raw login response (tokens, user, branches, ...) so a UI fixture can seed a
  // browser session from it, instead of logging in twice (once for the API, once for the UI).
  apiSession: async ({ apiClient }, use) => {
    const authService = new AuthService(apiClient);

    const email = process.env.ORG_ADMIN_EMAIL as string;
    const password = process.env.ORG_ADMIN_PASSWORD as string;
    const session = await authService.login(email, password);

    await use(session);
  },

  // Depending on apiSession (rather than logging in here) guarantees apiClient already
  // holds a valid auth token, without triggering a second login call.
  branchService: async ({ apiClient, apiSession: _apiSession }, use) => {
    await use(new BranchService(apiClient));
  },

  branchPayload: async ({}, use) => {
    await use(generateBranchPayload());
  },

  branchUpdatePayload: async ({}, use) => {
    await use(generateBranchUpdatePayload());
  },
});

export { expect } from '@playwright/test';
