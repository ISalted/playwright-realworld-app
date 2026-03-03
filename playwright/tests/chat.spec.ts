import { test, expect } from "../lib/fixtures";

const EXPECTED_RESPONSE = "This is a streamed AI response.";

test.describe.only("Interview Chat - AI Chat Mock @chat", () => {
  test.setTimeout(10_000);

  // --- Happy path ---

  test("CHAT-001: Page loads and displays all UI elements", async ({ chat }) => {
    await expect(chat.page).toHaveTitle(/AI Chat Interview Mock/);
    await expect(chat.chatInput).toHaveAttribute("placeholder", "Type something...");
    await expect(chat.heading).toBeVisible();
    await expect(chat.chatInput).toBeVisible();
    await expect(chat.submitButton).toBeVisible();
    await expect(chat.responseArea).toBeVisible();
    await expect(chat.status).toHaveText("Ready");
  });

  test("CHAT-002: Submit with valid text triggers streaming", async ({ chat }) => {
    await chat.sendMessage("Hello World");
    await chat.waitForStreamComplete();

    const responseText = await chat.getResponseText();
    expect(responseText).toBe(EXPECTED_RESPONSE);
    await expect(chat.status).toHaveText("Done!");
  });

  test("CHAT-003: Status transitions during streaming", async ({ chat }) => {
    await expect(chat.status).toHaveText("Ready");

    await chat.chatInput.fill("test");
    await chat.submitButton.click();

    await expect(chat.status).toHaveText("AI is typing...");
    await chat.waitForStreamComplete();
    await expect(chat.status).toHaveText("Done!");
  });

  test("CHAT-004: Submit button disabled during streaming", async ({ chat }) => {
    await chat.chatInput.fill("test");
    await chat.submitButton.click();

    await expect(chat.submitButton).toBeDisabled();
    await chat.waitForStreamComplete();
    await expect(chat.submitButton).toBeEnabled();
  });

  test("CHAT-005: Copy button appears after streaming completes", async ({ chat }) => {
    await expect(chat.copyButton).toBeHidden();

    await chat.sendMessage("test");
    await chat.waitForStreamComplete();

    await expect(chat.copyButton).toBeVisible();
  });

  test("CHAT-006: Copy button copies response to clipboard", async ({ chat }) => {
    await chat.sendMessage("test");
    await chat.waitForStreamComplete();

    await chat.copyButton.click();
    const clipboardText = await chat.getClipboardText();
    expect(clipboardText).toBe(EXPECTED_RESPONSE);
  });

  test("CHAT-007: Multiple requests in sequence", async ({ chat }) => {
    await chat.sendMessage("first");
    await chat.waitForStreamComplete();
    expect(await chat.getResponseText()).toBeTruthy();

    await chat.sendMessage("second");
    await chat.waitForStreamComplete();
    expect(await chat.getResponseText()).toBeTruthy();
  });

  test("CHAT-008: Long input text", async ({ chat }) => {
    const longText = "a".repeat(500);
    await chat.sendMessage(longText);
    await chat.waitForStreamComplete();

    expect(await chat.getResponseText()).toBeTruthy();
  });

  // --- Negative cases ---

  test("CHAT-N01: Empty input shows alert", async ({ chat }) => {
    let dialogMessage = "";
    chat.page.on("dialog", (dialog) => {
      dialogMessage = dialog.message();
      void dialog.accept();
    });

    await chat.submitButton.click();

    expect(dialogMessage).toBe("Enter text!");
  });

  test("CHAT-N02: Whitespace-only input shows alert", async ({ chat }) => {
    let dialogMessage = "";
    chat.page.on("dialog", (dialog) => {
      dialogMessage = dialog.message();
      void dialog.accept();
    });

    await chat.chatInput.fill("   \t  ");
    await chat.submitButton.click();

    expect(dialogMessage).toBe("Enter text!");
  });

  test("CHAT-N03: Submit button disabled during streaming (not clickable)", async ({ chat }) => {
    await chat.chatInput.fill("test");
    await chat.submitButton.click();

    await expect(chat.submitButton).toBeDisabled();
    await expect(chat.submitButton).toBeEnabled();
  });
});
