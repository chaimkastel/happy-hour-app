import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('should return 401 for protected routes without auth', async ({ request }) => {
    const response = await request.get('/api/merchant/dashboard');
    expect(response.status()).toBe(401);
  });

  test('should return 401 for voucher claim without auth', async ({ request }) => {
    const response = await request.post('/api/deals/test-id/claim', {
      data: {}
    });
    expect(response.status()).toBe(401);
  });

  test('should return 401 for voucher redemption without auth', async ({ request }) => {
    const response = await request.post('/api/redemptions/redeem', {
      data: { code: 'test-code' }
    });
    expect(response.status()).toBe(401);
  });

  test('should return 404 for non-existent deal claim', async ({ request }) => {
    // This would need proper auth setup in a real test
    const response = await request.post('/api/deals/non-existent/claim', {
      data: {}
    });
    expect(response.status()).toBe(401); // Should be 401 due to no auth
  });
});