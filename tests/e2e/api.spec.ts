import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  const baseURL = 'http://localhost:80';

  test('GET /api/health should return 200', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('GET /api/items should return array', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/items`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('POST /api/items should create item', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/items`, {
      data: {
        name: 'E2E Test Item',
        description: 'Created by Playwright test'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('E2E Test Item');
  });

  test('GET /api/game-results should return array', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/game-results`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('POST /api/game-results should create game result', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/game-results`, {
      data: {
        playerName: 'E2E Test Player',
        status: 'win',
        completionTime: 120,
        totalTime: 180
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.playerName).toBe('E2E Test Player');
    expect(data.status).toBe('win');
    expect(data.completionTime).toBe(120);
  });

  test('POST /api/code-outputs should save code output', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/code-outputs`, {
      data: {
        title: 'E2E Test Code',
        content: 'console.log("Hello from E2E test");',
        language: 'javascript'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('E2E Test Code');
  });
});
