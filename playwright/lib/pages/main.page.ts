import { BasePage } from './base.page';
import { step } from '../helpers/step';
import { expect } from '@playwright/test';

export class MainPage extends BasePage {
  // Scoping within 'root' ensures component isolation and stable chaining,
  // especially when unique test IDs are missing.
  private readonly sideBarRoot = this.page.getByText('Account Balance').locator('../../..');
  private readonly signoutBtn = this.sideBarRoot.getByText('Logout');
  private readonly toggleBtn = this.sideBarRoot.locator('[data-test="sidenav-toggle"]');
  private readonly transactionList = this.page.locator('[data-test="transaction-list"]');
  private readonly notificationsCount = this.page.locator('[data-test="nav-top-notifications-count"]');

  @step()
  async verifyTransactionListVisible() {
    await expect(this.transactionList).toBeVisible();
  }

  @step()
  async verifyNotificationsExist() {
    await expect(this.notificationsCount).toBeVisible();
  }

  @step()
  async logout(isMobile: boolean = false) {
    if (isMobile) {
      await this.toggleBtn.click();
    }
    await this.signoutBtn.click();
  }
}
