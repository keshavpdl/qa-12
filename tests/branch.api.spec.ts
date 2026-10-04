import { test, expect } from '../fixtures/api.fixture';

test.describe.serial('Branch API', () => {
  let branchSlug: string;

  test('Create a new branch', async ({ branchService, branchPayload }) => {
    const branch = await branchService.createBranch(branchPayload);

    expect(branch.name).toBe(branchPayload.name);
    expect(branch.slug).toBe(branchPayload.slug);
    expect(branch.status).toBe('active');

    branchSlug = branch.slug;
  });

  test('Partially update the branch status', async ({ branchService }) => {
    const branch = await branchService.updateBranchStatus(branchSlug, 'inactive');

    expect(branch.status).toBe('inactive');
    expect(branch.is_active).toBe(false);
  });

  test('Fully update the branch details', async ({ branchService, branchUpdatePayload }) => {
    const branch = await branchService.updateBranch(branchSlug, branchUpdatePayload);

    expect(branch.name).toBe(branchUpdatePayload.name);
    expect(branch.email).toBe(branchUpdatePayload.email);
    expect(branch.phone).toBe(branchUpdatePayload.phone);
    expect(branch.address).toBe(branchUpdatePayload.address);
    expect(branch.status).toBe(branchUpdatePayload.status);
  });

  test('Delete the branch', async ({ branchService }) => {
    await branchService.deleteBranch(branchSlug);

    const branches = await branchService.listBranches({ slug: branchSlug });
    expect(branches.results).toHaveLength(0);
  });
});
