import { APIRequestContext } from '@playwright/test';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TestDataService } from './services/test-data.service';

export class ApiClient {
  public readonly auth: AuthService;
  public readonly users: UserService;
  public readonly testData: TestDataService;

  constructor(public readonly request: APIRequestContext) {
    this.auth = new AuthService(request);
    this.users = new UserService(request);
    this.testData = new TestDataService(request);
  }

  async waitForTimeout(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
