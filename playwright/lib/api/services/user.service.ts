import { APIRequestContext } from '@playwright/test';

export class UserService {
  constructor(private readonly request: APIRequestContext) {}

  async getAll() {
    return await this.request.get('/users');
  }

  async getById(userId: string) {
    return await this.request.get(`/users/${userId}`);
  }

  async search(query: string) {
    return await this.request.get('/users/search', {
      params: { q: query },
    });
  }

  async create(userData: any) {
    return await this.request.post('/users', {
      data: userData,
    });
  }

  async signup(userData: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email?: string;
    phoneNumber?: string;
    avatar?: string;
    balance?: number;
  }) {
    return await this.request.post('/users', {
      data: {
        ...userData,
        email: userData.email || `${userData.username}@example.com`,
        phoneNumber: userData.phoneNumber || '1234567890',
        avatar: userData.avatar || 'https://s3.amazonaws.com/uifaces/avatars/twitter/josephstein/128.jpg',
        defaultPrivacyLevel: 'public'
      },
    });
  }
}
