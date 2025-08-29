import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  test('[API] Deals endpoint returns valid data', async ({ request }) => {
    const response = await request.get('/api/deals/search');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('deals');
    expect(Array.isArray(data.deals)).toBe(true);
  });

  test('[API] Address autocomplete handles queries', async ({ request }) => {
    const response = await request.get('/api/address/autocomplete?query=New York');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('predictions');
    expect(Array.isArray(data.predictions)).toBe(true);
  });

  test('[API] Address autocomplete rejects short queries', async ({ request }) => {
    const response = await request.get('/api/address/autocomplete?query=NY');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('ZERO_RESULTS');
  });

  test('[API] Rate limiting works', async ({ request }) => {
    // Make multiple rapid requests to test rate limiting
    const promises = Array(25).fill(0).map(() => 
      request.get('/api/address/autocomplete?query=test')
    );
    
    const responses = await Promise.all(promises);
    const statusCodes = responses.map(r => r.status());
    
    // Should have some 429 responses if rate limiting is working
    const rateLimitedResponses = statusCodes.filter(code => code === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('[API] Invalid parameters are rejected', async ({ request }) => {
    // Test with invalid limit parameter
    const response = await request.get('/api/deals?limit=invalid');
    
    // Should return 400 for invalid parameters
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('[API] Security headers are present', async ({ request }) => {
    const response = await request.get('/api/deals/search');
    
    // Check for rate limiting headers
    expect(response.headers()['x-ratelimit-limit']).toBeDefined();
    expect(response.headers()['x-ratelimit-remaining']).toBeDefined();
  });
});
