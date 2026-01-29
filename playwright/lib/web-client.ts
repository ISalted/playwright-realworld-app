import { expect, Page } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { SignUpPage } from './pages/signup.page';
import { OnboardingPage } from './pages/onboarding.page';
import { MainPage } from './pages/main.page';
import { step } from './helpers/step';

export class WebClient {
  public readonly loginPage: LoginPage;
  public readonly signUpPage: SignUpPage;
  public readonly onboardingPage: OnboardingPage;
  public readonly mainPage: MainPage;

  constructor(public readonly page: Page) {
    this.loginPage = new LoginPage(page);
    this.signUpPage = new SignUpPage(page);
    this.onboardingPage = new OnboardingPage(page);
    this.mainPage = new MainPage(page);
  }

  @step()
  async goTo(url: '/' | '/signin' | '/signup' | '/onboarding' | '/main' | '/personal' = '/') {
    await this.page.goto(url);
  }

  @step()
  async getUrl() {
    return this.page.url();
  }

  async waitFor(seconds: number) {
    await this.page.waitForTimeout(seconds * 1000);
  }

  async pause() {
    await this.page.pause();
  }
}
