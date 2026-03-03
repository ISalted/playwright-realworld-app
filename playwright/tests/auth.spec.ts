import { test, expect } from '../lib/fixtures';

test.describe('User Sign-up and Login', () => {

  let testUser: any;

  test.beforeEach(async ({ webClient, apiClient }) => {
    testUser = {
      firstName: 'Sincere',
      lastName: 'Mertz',
      username: `Sincere_Mertz_${Date.now()}`,
      password: 's3cret',
    };

    await apiClient.users.signup(testUser);
    await webClient.goTo('/');
  });

  test('AUTH-001: should redirect unauthenticated user to signin page', async ({ webClient, page }) => {
    await webClient.goTo('/personal');
    await expect(page).toHaveURL(/\/signin/);
  });

  test('AUTH-002: should redirect to the home page after login', async ({ webClient }) => {
    await webClient.loginPage.login(testUser.username, testUser.password);
    await expect(webClient.page).toHaveURL('http://localhost:3000/');
  });

  test('AUTH-003: should remember a user for 30 days after login', async ({ webClient, context, helpers }) => {
    await webClient.loginPage.login(testUser.username, testUser.password, true);

    await expect(webClient.page).toHaveURL('http://localhost:3000/');
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'connect.sid');

    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.expires).toBeDefined();

    expect(sessionCookie!.expires).toBeGreaterThan(helpers.getUnixTimestamp(29));
  });

  test('AUTH-004: should allow a visitor to login and onboard', async ({ webClient, page }) => {
    // Login User
    await webClient.loginPage.login(testUser.username, testUser.password);

    // Onboarding
    await webClient.onboardingPage.verifyVisible();
    await webClient.mainPage.verifyNotificationsExist();
    await webClient.onboardingPage.clickNext();

    await webClient.onboardingPage.verifyStepTitle('Create Bank Account');
    await webClient.onboardingPage.fillBankInformation('The Best Bank', '123456789', '987654321');

    await webClient.onboardingPage.verifyFinished();
    await webClient.onboardingPage.clickNext();

    await webClient.mainPage.verifyTransactionListVisible();

    const isMobile = page.viewportSize()?.width! < 600;
    await webClient.mainPage.logout(isMobile);
    await expect(page).toHaveURL('http://localhost:3000/signin');
  });

  test('AUTH-005: should display login errors', async ({ webClient }) => {
    await webClient.loginPage.clearUsername();
    await webClient.loginPage.verifyUsernameError('Username is required');

    await webClient.loginPage.fillPassword('abc');
    await webClient.loginPage.verifyPasswordError('Password must contain at least 4 characters');

    await webClient.loginPage.verifySubmitDisabled();
  });

  test('AUTH-006: should display signup errors', async ({ webClient }) => {
    await webClient.goTo('/signup');

    // First Name error
    await webClient.signUpPage.clearFirstName();
    await webClient.signUpPage.verifyFirstNameError('First Name is required');

    // Last Name error
    await webClient.signUpPage.clearLastName();
    await webClient.signUpPage.verifyLastNameError('Last Name is required');

    // Username error
    await webClient.signUpPage.clearUsername();
    await webClient.signUpPage.verifyUsernameError('Username is required');

    // Password error
    await webClient.signUpPage.clearPassword();
    await webClient.signUpPage.verifyPasswordError('Enter your password');

    // Confirm Password error
    await webClient.signUpPage.fillConfirmPassword('DIFFERENT PASSWORD');
    await webClient.signUpPage.verifyConfirmPasswordError('Password does not match');

    await webClient.signUpPage.verifySubmitDisabled();
  });

  test('AUTH-007: should error for an invalid user', async ({ webClient }) => {
    await webClient.loginPage.login('invalidUserName', 'invalidPa$$word');
    await webClient.loginPage.verifyErrorMessage('Username or password is invalid');
  });

  test('AUTH-008: should error for an invalid password for existing user', async ({ webClient }) => {
    await webClient.loginPage.login(testUser.username, 'INVALID');

    await webClient.loginPage.verifyErrorMessage('Username or password is invalid');
  });
});
