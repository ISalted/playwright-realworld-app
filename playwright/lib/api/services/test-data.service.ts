import { APIRequestContext } from '@playwright/test';

export class TestDataService {
  constructor(private readonly request: APIRequestContext) {}

  async seed() {
    return await this.request.post('/testData/seed');
  }

  async getEntity(entity: string) {
    return await this.request.get(`/testData/${entity}`);
  }
}
