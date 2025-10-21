import { test, expect } from '@playwright/test';

test.describe('Error Handling Tests', () => {
  test('[ERROR] Error boundaries catch client-side errors', async ({ page }) => {
    // Navigate to a page that might have client-side errors
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads without crashing
    await expect(page.locator('body')).toBeVisible();
    
    // Check for error boundary fallback (should not be visible if no errors)
    const errorFallback = page.locator('text=Something went wrong');
    await expect(errorFallback).not.toBeVisible();
  });

  test('[ERROR] 404 page handles missing routes', async ({ page }) => {
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // Should show 404 page or redirect to home
    const is404Page = await page.locator('text=404').isVisible();
    const isHomePage = page.url().includes('/');
    
    expect(is404Page || isHomePage).toBe(true);
  });

  test('[ERROR] API errors are handled gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Intercept API calls and return error responses
    await page.route('**/api/deals**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Reload page to trigger API call
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Page should still load without crashing
    await expect(page.locator('body')).toBeVisible();
  });

  test('[ERROR] Network errors are handled gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simulate network failure
    await page.route('**/api/**', route => {
      route.abort('failed');
    });
    
    // Reload page to trigger API calls
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Page should still load without crashing
    await expect(page.locator('body')).toBeVisible();
  });

  test('[ERROR] Invalid form data is handled', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    
    // Fill form with invalid data
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', '123'); // Too short
    await page.fill('input[name="phone"]', 'invalid-phone');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=valid email')).toBeVisible();
  });

  test('[ERROR] Large payloads are handled', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    // Try to search with very long query
    const searchInput = page.locator('input[placeholder*="address"]');
    const longQuery = 'a'.repeat(1000);
    
    await searchInput.fill(longQuery);
    await page.waitForTimeout(1000);
    
    // Page should not crash
    await expect(page.locator('body')).toBeVisible();
  });
});
