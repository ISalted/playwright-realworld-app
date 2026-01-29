import { test as base, expect } from '@playwright/test';
import { WebClient } from './web-client';
import { ApiClient } from './api-client';
import { Helpers } from './helpers/helpers';

type MyFixtures = {
  webClient: WebClient;
  apiClient: ApiClient;
  helpers: Helpers;
};

export const test = base.extend<MyFixtures>({
  helpers: async ({ page }, use) => {
    await use(new Helpers());
  },
  webClient: async ({ page }, use) => {
    const webClient = new WebClient(page);
    await use(webClient);
  },

  apiClient: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: process.env.API_URL,
    });
    const apiClient = new ApiClient(apiContext);
    await use(apiClient);
    await apiContext.dispose();
  },
});

export { expect };
