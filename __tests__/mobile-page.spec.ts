import { test, expect } from '@playwright/test';

test.describe('Mobile Page', () => {
  test('should render mobile UI at desktop viewport', async ({ page }) => {
    // Visit /mobile at desktop viewport (1200x800)
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/mobile');
    
    // Wait for content to load
    await page.waitForSelector('text=Enjoy Amazing Deals', { timeout: 10000 });
    
    // Verify mobile-specific content is visible
    await expect(page.locator('text=Enjoy Amazing Deals')).toBeVisible();
    await expect(page.locator('text=deals near you')).toBeVisible();
    
    // Verify mobile header is present
    await expect(page.locator('text=Happy Hour')).toBeVisible();
    
    // Verify bottom navigation is present
    await expect(page.locator('text=Explore')).toBeVisible();
    await expect(page.locator('text=Favorites')).toBeVisible();
  });

  test('should render mobile UI at mobile viewport', async ({ page }) => {
    // Visit /mobile at mobile viewport (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/mobile');
    
    // Wait for content to load
    await page.waitForSelector('text=Enjoy Amazing Deals', { timeout: 10000 });
    
    // Verify mobile-specific content is visible
    await expect(page.locator('text=Enjoy Amazing Deals')).toBeVisible();
    await expect(page.locator('text=deals near you')).toBeVisible();
  });

  test('should not interfere with desktop homepage', async ({ page }) => {
    // Visit / at desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    // Verify desktop content is visible
    await expect(page.locator('text=Find Deals')).toBeVisible();
    
    // Verify mobile-specific content is not visible on desktop homepage
    await expect(page.locator('text=Enjoy Amazing Deals')).not.toBeVisible();
  });
});
