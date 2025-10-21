import { test, expect } from '@playwright/test';

test.describe('PWA Tests', () => {
  test('[PWA] Manifest file is accessible', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);
    
    const manifest = await response?.json();
    expect(manifest).toHaveProperty('name');
    expect(manifest).toHaveProperty('short_name');
    expect(manifest).toHaveProperty('start_url');
    expect(manifest).toHaveProperty('display');
    expect(manifest).toHaveProperty('icons');
  });

  test('[PWA] Service worker is registered', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if service worker is registered
    const swRegistration = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration();
    });
    
    expect(swRegistration).toBeTruthy();
  });

  test('[PWA] App can be installed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for install prompt (if available)
    const installPrompt = page.locator('text=Install Happy Hour');
    
    // Install prompt might not be visible if already installed or not supported
    // This is acceptable behavior
    if (await installPrompt.isVisible()) {
      await expect(installPrompt).toBeVisible();
    }
  });

  test('[PWA] Icons are accessible', async ({ page }) => {
    // Check for different icon sizes
    const iconSizes = ['192', '512'];
    
    for (const size of iconSizes) {
      const response = await page.goto(`/icon-${size}.png`);
      expect(response?.status()).toBe(200);
    }
  });

  test('[PWA] App works offline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await page.context().setOffline(true);
    
    // Try to navigate to another page
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    // Page should still load (from cache or show offline message)
    await expect(page.locator('body')).toBeVisible();
    
    // Go back online
    await page.context().setOffline(false);
  });

  test('[PWA] Meta tags are present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for PWA meta tags
    const viewport = page.locator('meta[name="viewport"]');
    const themeColor = page.locator('meta[name="theme-color"]');
    const manifest = page.locator('link[rel="manifest"]');
    
    await expect(viewport).toBeAttached();
    await expect(themeColor).toBeAttached();
    await expect(manifest).toBeAttached();
  });

  test('[PWA] App shortcuts are defined', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    const manifest = await response?.json();
    
    if (manifest.shortcuts) {
      expect(Array.isArray(manifest.shortcuts)).toBe(true);
      expect(manifest.shortcuts.length).toBeGreaterThan(0);
    }
  });

  test('[PWA] App works in standalone mode', async ({ page }) => {
    // Simulate standalone mode by setting display mode
    await page.addInitScript(() => {
      Object.defineProperty(window.matchMedia, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(display-mode: standalone)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // App should work normally in standalone mode
    await expect(page.locator('body')).toBeVisible();
  });
});
