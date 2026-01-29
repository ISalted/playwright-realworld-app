import { APIRequestContext } from '@playwright/test';

export class AuthService {
  constructor(private readonly request: APIRequestContext) {}

  async login(username: string, password: string = 's3cret') {
    return await this.request.post('/login', {
      data: {
        username,
        password,
      },
    });
  }
}
