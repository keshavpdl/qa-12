import { Page, Locator, expect } from '@playwright/test';
import {
  branchListLocators,
  branchRow,
  branchRowAction,
  branchFormLocators,
  branchAdminFormLocators,
  statusOption,
  deleteDialogLocators,
  toastLocators,
} from '../locators/branch.locator';
import { BranchData, BranchUpdateData } from '../fixtures/branch-data';

export class BranchPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToBranchList() {
    await branchListLocators(this.page).branchesNavLink.click();
  }

  async openAddBranchForm() {
    await branchListLocators(this.page).addBranchButton.click();
  }

  async searchBranch(query: string) {
    await branchListLocators(this.page).searchInput.fill(query);
  }

  private async fillPhoneNumber(phoneInput: Locator, phoneNumber: string) {
    await phoneInput.click();
    await phoneInput.press('End');

    const existingSubscriberNumber = (await phoneInput.inputValue()).replace(/^\+\d+\s*/, '');
    for (let i = 0; i < existingSubscriberNumber.length; i += 1) {
      await phoneInput.press('Backspace');
    }

    await phoneInput.pressSequentially(phoneNumber);
  }

  private async selectStatus(status: 'Active' | 'Inactive') {
    await branchFormLocators(this.page).statusDropdown.click();
    await statusOption(this.page, status).click();
  }

  private async fillBranchDetails(data: {
    name: string;
    phone: string;
    email: string;
    address: string;
    status: 'Active' | 'Inactive';
    slug?: string;
  }) {
    const form = branchFormLocators(this.page);

    await form.nameInput.fill(data.name);
    if (data.slug) {
      await form.slugInput.fill(data.slug);
    }
    await this.fillPhoneNumber(form.phoneInput, data.phone);
    await form.emailInput.fill(data.email);
    await form.addressInput.fill(data.address);
    await this.selectStatus(data.status);
  }

  private async fillBranchAdminDetails(admin: BranchData['admin']) {
    const adminForm = branchAdminFormLocators(this.page);

    await adminForm.firstNameInput.fill(admin.firstName);
    await adminForm.lastNameInput.fill(admin.lastName);
    await adminForm.emailInput.fill(admin.email);
    await adminForm.passwordInput.fill(admin.password);
    await this.fillPhoneNumber(adminForm.phoneInput, admin.phone);
  }

  private async saveChanges() {
    await branchFormLocators(this.page).saveChangesButton.click();
  }

  async createBranch(data: BranchData) {
    await this.openAddBranchForm();
    await this.fillBranchDetails(data);
    await this.fillBranchAdminDetails(data.admin);
    await this.saveChanges();
  }

  getRow(slug: string) {
    return branchRow(this.page, slug);
  }

  private async openEditForm(slug: string) {
    await branchRowAction(this.getRow(slug)).editButton.click();

    // Wait for the branch's data to hydrate before editing any field.
    await expect(branchFormLocators(this.page).slugInput).toHaveValue(slug);
  }

  async updateBranchStatus(slug: string, status: 'Active' | 'Inactive') {
    await this.openEditForm(slug);
    await this.selectStatus(status);
    await this.saveChanges();
  }

  async updateBranchDetails(slug: string, data: BranchUpdateData) {
    await this.openEditForm(slug);
    await this.fillBranchDetails(data);
    await this.saveChanges();
  }

  async deleteBranch(slug: string) {
    await branchRowAction(this.getRow(slug)).deleteButton.click();

    const dialog = deleteDialogLocators(this.page);
    await dialog.confirmationInput.fill('Delete Branch');
    await dialog.deleteButton.click();
  }

  async verifyToast(title: string, message: string) {
    const toast = toastLocators(this.page, title, message);

    await expect(toast.title).toBeVisible();
    await expect(toast.message).toBeVisible();
  }

  async verifyBranchVisible(slug: string) {
    await expect(this.getRow(slug)).toBeVisible();
  }

  async verifyBranchRemoved(slug: string) {
    await expect(this.getRow(slug)).toHaveCount(0);
  }

  async verifyBranchName(slug: string, expectedName: string) {
    await expect(this.getRow(slug)).toContainText(expectedName);
  }

  async verifyBranchStatus(slug: string, expectedStatus: 'Active' | 'Inactive') {
    await expect(this.getRow(slug)).toContainText(new RegExp(expectedStatus, 'i'));
  }
}
