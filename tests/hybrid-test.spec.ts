import { test, expect } from '../fixtures/hybrid.fixture';

test.describe('Hybrid Branch Automation', () => {
  test('authenticates via API, creates a branch through the UI, and tears it down via the API', async ({
    branchPage,
    branchData,
    branchService,
  }) => {
    // Setup (authentication): the browser session was already restored from an API login
    // by the branchPage fixture, without touching the UI login form.

    // Action: create the branch through the real UI workflow.
    await branchPage.createBranch(branchData);

    try {
      await branchPage.verifyToast('Branch Created', 'The branch has been created successfully.');
      await branchPage.verifyBranchVisible(branchData.slug);
      await branchPage.verifyBranchStatus(branchData.slug, 'Active');
    } finally {
      // Cleanup: tear down via the API, regardless of whether the UI assertions passed.
      await branchService.deleteBranch(branchData.slug);
    }

    const remaining = await branchService.listBranches({ slug: branchData.slug });
    expect(remaining.results).toHaveLength(0);
  });
});
