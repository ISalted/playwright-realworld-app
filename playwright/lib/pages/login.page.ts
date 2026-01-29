import { BasePage } from './base.page';
import { step } from '../helpers/step';
import { expect } from '@playwright/test';

export class LoginPage extends BasePage {
  // Scoping within 'root' ensures component isolation and stable chaining,
  // especially when unique test IDs are missing.
  private readonly root = this.page.locator('.SignInForm-paper');
  private readonly usernameInput = this.root.getByRole('textbox', { name: 'Username' });
  private readonly passwordInput = this.root.getByRole('textbox', { name: 'Password' });
  private readonly submitButton = this.root.locator('[data-test="signin-submit"]');
  private readonly signupLink = this.root.locator('[data-test="signup"]');
  private readonly errorMessage = this.root.locator('[data-test="signin-error"]');
  private readonly rememberMeCheckbox = this.root.getByRole('checkbox', { name: 'Remember me' });
  private readonly usernameError = this.page.locator('#username-helper-text');

  @step()
  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
    await this.usernameInput.blur();
  }

  @step()
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
    await this.passwordInput.blur();
  }

  @step()
  async login(username: string, password: string, remember: boolean = false) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    if (remember) {
      await this.rememberMeCheckbox.check();
    }
    await this.submitButton.click();
  }


  @step()
  async goToSignup() {
    await this.signupLink.click();
  }

  @step()
  async verifyErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(message);
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
  async verifySubmitDisabled() {
    await expect(this.submitButton).toBeDisabled();
  }

  @step()
  async clearUsername() {
    await this.usernameInput.clear();
    await this.usernameInput.blur();
  }

  @step()
  async clearPassword() {
    await this.passwordInput.locator('input').clear();
    await this.passwordInput.locator('input').blur();
  }
}
