import { Locator, Page } from '@playwright/test';

export interface BranchListLocators {
  branchesNavLink: Locator;
  addBranchButton: Locator;
  searchInput: Locator;
}

export const branchListLocators = (page: Page): BranchListLocators => ({
  branchesNavLink: page.getByRole('link', { name: 'Branches' }),
  addBranchButton: page.getByRole('button', { name: 'Add Branch' }).first(),
  searchInput: page.getByPlaceholder('Search...'),
});

export const branchRow = (page: Page, identifier: string): Locator =>
  page.locator('tr', { hasText: identifier });

export const branchRowAction = (row: Locator) => ({
  editButton: row.getByTitle('Edit branch'),
  deleteButton: row.getByTitle('Delete branch'),
});

export interface BranchFormLocators {
  nameInput: Locator;
  slugInput: Locator;
  phoneInput: Locator;
  emailInput: Locator;
  addressInput: Locator;
  statusDropdown: Locator;
  saveChangesButton: Locator;
}

export const branchFormLocators = (page: Page): BranchFormLocators => {
  const form = page.locator('form').nth(0);
  return {
    nameInput: form.locator('#name'),
    slugInput: form.locator('#slug'),
    phoneInput: form.getByPlaceholder('Enter phone number'),
    emailInput: form.locator('#email'),
    addressInput: form.locator('#address'),
    statusDropdown: form.getByRole('combobox').first(),
    saveChangesButton: page.getByRole('button', { name: 'Save Changes' }),
  };
};

export const statusOption = (page: Page, status: 'Active' | 'Inactive'): Locator =>
  page.getByRole('option', { name: status, exact: true });

export interface BranchAdminFormLocators {
  firstNameInput: Locator;
  lastNameInput: Locator;
  emailInput: Locator;
  passwordInput: Locator;
  phoneInput: Locator;
}

export const branchAdminFormLocators = (page: Page): BranchAdminFormLocators => {
  const form = page.locator('form').nth(1);
  return {
    firstNameInput: form.locator('#admin_first_name'),
    lastNameInput: form.locator('#admin_last_name'),
    emailInput: form.locator('#admin_email'),
    passwordInput: form.locator('[name="admin_password"]'),
    phoneInput: form.getByPlaceholder('Enter phone number'),
  };
};

export interface DeleteDialogLocators {
  confirmationInput: Locator;
  deleteButton: Locator;
}

export const deleteDialogLocators = (page: Page): DeleteDialogLocators => {
  const dialog = page.getByRole('dialog');
  return {
    confirmationInput: dialog.getByPlaceholder('Type Delete Branch here'),
    deleteButton: dialog.getByRole('button', { name: 'Delete Branch' }),
  };
};

export const toastLocators = (page: Page, title: string, message: string) => ({
  title: page.getByText(title, { exact: true }),
  message: page.getByText(message),
});
