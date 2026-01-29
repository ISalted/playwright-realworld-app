import { BasePage } from './base.page';
import { step } from '../helpers/step';
import { expect } from '@playwright/test';

export class SignUpPage extends BasePage {
  // Scoping within 'root' ensures component isolation and stable chaining,
  // especially when unique test IDs are missing.
  private readonly firstNameInput = this.page.locator('[data-test="signup-first-name"]');
  private readonly lastNameInput = this.page.locator('[data-test="signup-last-name"]');
  private readonly usernameInput = this.page.locator('[data-test="signup-username"]');
  private readonly passwordInput = this.page.locator('[data-test="signup-password"]');
  private readonly confirmPasswordInput = this.page.locator('[data-test="signup-confirmPassword"]');
  private readonly submitButton = this.page.locator('[data-test="signup-submit"]');
  private readonly title = this.page.locator('[data-test="signup-title"]');

  @step()
  async signup(user: any) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.password);
    await this.submitButton.click();
  }

  @step()
  async verifyTitle(expected: string) {
    await expect(this.title).toBeVisible();
    await expect(this.title).toContainText(expected);
  }

  @step()
  async verifyFirstNameError(message: string) {
    await expect(this.page.locator('#firstName-helper-text')).toContainText(message);
  }

  @step()
  async verifyLastNameError(message: string) {
    await expect(this.page.locator('#lastName-helper-text')).toContainText(message);
  }

  @step()
  async verifyUsernameError(message: string) {
    await expect(this.page.locator('#username-helper-text')).toContainText(message);
  }

  @step()
  async verifyPasswordError(message: string) {
    await expect(this.page.locator('#password-helper-text')).toContainText(message);
  }

  @step()
  async verifyConfirmPasswordError(message: string) {
    await expect(this.page.locator('#confirmPassword-helper-text')).toContainText(message);
  }

  @step()
  async clearFirstName() {
    await this.firstNameInput.locator('input').fill('a');
    await this.firstNameInput.locator('input').clear();
    await this.firstNameInput.locator('input').blur();
  }

  @step()
  async clearLastName() {
    await this.lastNameInput.locator('input').fill('a');
    await this.lastNameInput.locator('input').clear();
    await this.lastNameInput.locator('input').blur();
  }

  @step()
  async clearUsername() {
    await this.usernameInput.locator('input').fill('a');
    await this.usernameInput.locator('input').clear();
    await this.usernameInput.locator('input').blur();
  }

  @step()
  async clearPassword() {
    await this.passwordInput.locator('input').fill('a');
    await this.passwordInput.locator('input').clear();
    await this.passwordInput.locator('input').blur();
  }

  @step()
  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.locator('input').fill(password);
    await this.confirmPasswordInput.locator('input').blur();
  }

  @step()
  async verifySubmitDisabled() {
    await expect(this.submitButton).toBeDisabled();
  }
}
