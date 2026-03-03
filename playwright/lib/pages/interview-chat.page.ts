import { Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { step } from "../helpers/step";

/**
 * Page Object for interview-chat.html (AI Chat Interview Mock)
 *
 * Main selectors (data-testid):
 * - chat-input      — message input field
 * - response-area   — AI response display area
 * - submit-button   — "Generate Response" button
 * - copy-button     — "Copy" button (hidden initially)
 *
 * Additional selectors (id):
 * - #user-input, #display, #gen-btn, #copy-btn, #status
 */
export class ChatPage extends BasePage {
  /** Page heading */
  readonly heading = this.page.getByRole("heading", { name: "AI Chat Mock" });
  /** Message input (data-testid="chat-input") */
  readonly chatInput = this.page.getByTestId("chat-input");
  /** AI response area (data-testid="response-area") */
  readonly responseArea = this.page.getByTestId("response-area");
  /** Generate Response button (data-testid="submit-button") */
  readonly submitButton = this.page.getByTestId("submit-button");
  /** Copy button (data-testid="copy-button") */
  readonly copyButton = this.page.getByTestId("copy-button");
  /** Status text (Ready / AI is thinking... / AI is typing... / Done!) */
  readonly status = this.page.locator("#status");

  constructor(page: Page) {
    super(page);
  }

  /** Wait for page to load (heading visible) */
  @step()
  async waitForReady(timeout = 5000) {
    await this.heading.waitFor({ state: "visible", timeout });
  }

  /** Type text and click Generate Response */
  @step()
  async sendMessage(text: string) {
    await this.chatInput.fill(text);
    await this.submitButton.click();
  }

  /** Get text from response area */
  @step()
  async getResponseText() {
    return this.responseArea.innerText();
  }

  /** Get status text */
  @step()
  async getStatusText() {
    return this.status.innerText();
  }

  /** Wait for streaming to complete (status "Done!") */
  @step()
  async waitForStreamComplete(timeout = 5000) {
    await this.status.waitFor({ state: "visible", timeout });
    await this.page.waitForFunction(
      () => document.querySelector("#status")?.textContent?.trim() === "Done!",
      { timeout }
    );
  }

  /** Read clipboard text (for Copy button test; needs clipboard-read permission) */
  @step()
  async getClipboardText(): Promise<string> {
    return this.page.evaluate(async () => navigator.clipboard.readText());
  }
}
