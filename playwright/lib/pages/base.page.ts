import { Page } from '@playwright/test';
import { step } from '../helpers/step';

export class BasePage {
  constructor(protected readonly page: Page) {}

  @step()
  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  @step()
  async getByTestId(testId: string) {
    return this.page.locator(`[data-test="${testId}"]`);
  }

  @step()
  async getByTestIdLike(testIdPrefix: string) {
    return this.page.locator(`[data-test^="${testIdPrefix}"]`);
  }
}
