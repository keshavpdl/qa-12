import { test, expect } from '../fixtures/branch.fixture';

test.describe.serial('Branch Management', () => {
  let branchSlug: string;

  test('Create a new branch with admin details', async ({ branchPage, branchData }) => {
    branchSlug = branchData.slug;

    await branchPage.createBranch(branchData);

    await branchPage.verifyToast('Branch Created', 'The branch has been created successfully.');
    await branchPage.verifyBranchVisible(branchSlug);
    await branchPage.verifyBranchStatus(branchSlug, 'Active');
  });

  test('Partially update the branch by changing its status', async ({ branchPage }) => {
    await branchPage.updateBranchStatus(branchSlug, 'Inactive');

    await branchPage.verifyToast('Branch Updated', 'The branch has been updated successfully.');
    await branchPage.verifyBranchStatus(branchSlug, 'Inactive');
  });

  test('Fully update the branch details', async ({ branchPage, branchUpdateData }) => {
    await branchPage.updateBranchDetails(branchSlug, branchUpdateData);

    await branchPage.verifyToast('Branch Updated', 'The branch has been updated successfully.');
    await branchPage.verifyBranchName(branchSlug, branchUpdateData.name);
    await branchPage.verifyBranchStatus(branchSlug, branchUpdateData.status);
  });

  test('Delete the branch', async ({ branchPage }) => {
    await branchPage.deleteBranch(branchSlug);

    await branchPage.verifyToast('Deleted', 'The item has been deleted successfully.');
    await branchPage.verifyBranchRemoved(branchSlug);
  });
});
