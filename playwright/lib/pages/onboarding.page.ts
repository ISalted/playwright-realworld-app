import { BasePage } from './base.page';
import { step } from '../helpers/step';
import { expect } from '@playwright/test';

export class OnboardingPage extends BasePage {
  // Scoping within 'root' ensures component isolation and stable chaining,
  // especially when unique test IDs are missing.
  private readonly dialog = this.page.locator('[data-test="user-onboarding-dialog"]');
  private readonly nextButton = this.page.locator('[data-test="user-onboarding-next"]');
  private readonly dialogTitle = this.page.locator('[data-test="user-onboarding-dialog-title"]');
  private readonly dialogContent = this.page.locator('[data-test="user-onboarding-dialog-content"]');

  private readonly bankNameInput = this.page.getByRole('textbox', { name: 'Bank Name' });
  private readonly accountNumberInput = this.page.getByRole('textbox', { name: 'Account Number' });
  private readonly routingNumberInput = this.page.getByRole('textbox', { name: 'Routing Number' });
  private readonly bankSubmitButton = this.page.getByRole("button", { name: "Save" });

  @step()
  async verifyVisible() {
    await expect(this.dialog).toBeVisible();
  }

  @step()
  async clickNext() {
    await this.nextButton.click();
  }

  @step()
  async fillBankInformation(bankName: string, accountNumber: string, routingNumber: string) {
    await this.bankNameInput.fill(bankName);
    await this.accountNumberInput.fill(accountNumber);
    await this.routingNumberInput.fill(routingNumber);
    await this.bankSubmitButton.click();
  }

  @step()
  async verifyStepTitle(title: string) {
    await expect(this.dialogTitle).toContainText(title);
  }

  @step()
  async verifyFinished() {
    await expect(this.dialogTitle).toContainText('Finished');
    await expect(this.dialogContent).toContainText("You're all set!");
  }
}
