import { test, expect } from '@playwright/test';

test.describe('Redemption Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as merchant for redemption tests
    await page.goto('/merchant/login');
    await page.fill('input[type="email"]', 'merchant@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/merchant');
  });

  test('Voucher redemption is idempotent', async ({ page }) => {
    // Navigate to redemption page
    await page.goto('/merchant/redeem');
    
    // Get a test voucher code (this would need to be set up in test data)
    const testCode = 'TEST-CODE-123';
    
    // First redemption attempt
    await page.fill('input[placeholder*="code" i]', testCode);
    await page.click('button[type="submit"]');
    
    // Check for success message
    await expect(page.getByText(/redeemed successfully/i)).toBeVisible();
    
    // Second redemption attempt with same code
    await page.fill('input[placeholder*="code" i]', testCode);
    await page.click('button[type="submit"]');
    
    // Should show already redeemed error
    await expect(page.getByText(/already been redeemed/i)).toBeVisible();
  });

  test('Redemption respects time window', async ({ page }) => {
    await page.goto('/merchant/redeem');
    
    // Test with expired voucher
    const expiredCode = 'EXPIRED-CODE-123';
    await page.fill('input[placeholder*="code" i]', expiredCode);
    await page.click('button[type="submit"]');
    
    // Should show expired error
    await expect(page.getByText(/expired/i)).toBeVisible();
  });

  test('Redemption validates voucher code format', async ({ page }) => {
    await page.goto('/merchant/redeem');
    
    // Test with invalid code format
    await page.fill('input[placeholder*="code" i]', 'invalid');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.getByText(/invalid.*code/i)).toBeVisible();
  });

  test('Redemption rate limiting works', async ({ page }) => {
    await page.goto('/merchant/redeem');
    
    // Attempt multiple redemptions quickly
    for (let i = 0; i < 5; i++) {
      await page.fill('input[placeholder*="code" i]', `RATE-LIMIT-${i}`);
      await page.click('button[type="submit"]');
      
      // Wait a bit between attempts
      await page.waitForTimeout(100);
    }
    
    // Should eventually hit rate limit
    await expect(page.getByText(/too many requests/i)).toBeVisible();
  });

  test('Redemption with idempotency key', async ({ page }) => {
    await page.goto('/merchant/redeem');
    
    const testCode = 'IDEMPOTENT-CODE-123';
    const idempotencyKey = 'test-key-123';
    
    // Set idempotency key in request headers (this would need to be implemented)
    await page.evaluate((key) => {
      window.localStorage.setItem('idempotency-key', key);
    }, idempotencyKey);
    
    // First request
    await page.fill('input[placeholder*="code" i]', testCode);
    await page.click('button[type="submit"]');
    
    // Second request with same idempotency key
    await page.fill('input[placeholder*="code" i]', testCode);
    await page.click('button[type="submit"]');
    
    // Should return same response (idempotent)
    await expect(page.getByText(/redeemed successfully/i)).toBeVisible();
  });

  test('Redemption error handling', async ({ page }) => {
    await page.goto('/merchant/redeem');
    
    // Test with non-existent code
    await page.fill('input[placeholder*="code" i]', 'NONEXISTENT-CODE');
    await page.click('button[type="submit"]');
    
    // Should show not found error
    await expect(page.getByText(/not found/i)).toBeVisible();
  });

  test('Redemption audit trail', async ({ page }) => {
    await page.goto('/merchant/redeem');
    
    const testCode = 'AUDIT-CODE-123';
    await page.fill('input[placeholder*="code" i]', testCode);
    await page.click('button[type="submit"]');
    
    // Check that redemption appears in audit log
    await page.goto('/merchant/redemptions');
    await expect(page.getByText(testCode)).toBeVisible();
  });
});

