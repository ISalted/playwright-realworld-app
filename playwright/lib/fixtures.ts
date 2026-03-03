import { test as base, expect } from "@playwright/test";
import path from "path";
import { WebClient } from "./web-client";
import { ApiClient } from "./api-client";
import { Helpers } from "./helpers/helpers";
import { ChatPage } from "./pages/interview-chat.page";

export const INTERVIEW_CHAT_PAGE_URL = "file://" + path.join(process.cwd(), "interview-chat.html");

type MyFixtures = {
  webClient: WebClient;
  apiClient: ApiClient;
  helpers: Helpers;
  chat: ChatPage;
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

  chat: async ({ page }, use) => {
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    const chatPage = new ChatPage(page);
    await page.goto(INTERVIEW_CHAT_PAGE_URL);
    await chatPage.waitForReady();
    await use(chatPage);
  },
});

export { expect };
