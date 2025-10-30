import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('Home page loads and navigates to explore', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Happy Hour/);
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /Happy Hour/i })).toBeVisible();
    
    // Check navigation to explore
    const exploreLink = page.locator('[data-testid="nav-explore"]').first();
    await expect(exploreLink).toBeVisible();
    await exploreLink.click();
    
    // Should be on explore page
    await expect(page).toHaveURL(/\/explore/);
  });

  test('Explore page loads and shows deals', async ({ page }) => {
    await page.goto('/explore');
    
    // Check page loads
    await expect(page).toHaveTitle(/Explore/);
    
    // Check for search functionality
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();
    
    // Check for filter options
    const filterButton = page.getByRole('button', { name: /filter/i });
    await expect(filterButton).toBeVisible();
  });

  test('Deal detail page loads', async ({ page }) => {
    // First go to explore to get a deal ID
    await page.goto('/explore');
    
    // Wait for deals to load
    await page.waitForSelector('[data-testid="deal-card"]', { timeout: 10000 });
    
    // Click on first deal
    const firstDeal = page.locator('[data-testid="deal-card"]').first();
    await firstDeal.click();
    
    // Should be on deal detail page
    await expect(page).toHaveURL(/\/deal\/[a-zA-Z0-9]+/);
    
    // Check deal details are visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    const navLinks = [
      { name: /explore/i, url: /\/explore/ },
      { name: /favorites/i, url: /\/favorites/ },
      { name: /account/i, url: /\/account/ },
      { name: /wallet/i, url: /\/wallet/ },
    ];
    
    for (const link of navLinks) {
      const navLink = page.getByRole('link', { name: link.name });
      if (await navLink.isVisible()) {
        await navLink.click();
        await expect(page).toHaveURL(link.url);
        await page.goBack();
      }
    }
  });

  test('Mobile responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile navigation
    const mobileMenuButton = page.getByRole('button', { name: /menu/i });
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Check mobile menu items
      await expect(page.getByRole('link', { name: /explore/i })).toBeVisible();
    }
  });

  test('Accessibility basics', async ({ page }) => {
    await page.goto('/');
    
    // Check for skip to main content link
    const skipLink = page.getByRole('link', { name: /skip to main/i });
    await expect(skipLink).toBeVisible();
    
    // Check for proper heading structure
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('PWA manifest and service worker', async ({ page }) => {
    await page.goto('/');
    
    // Check for manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', /manifest/);
    
    // Check for service worker registration
    const swRegistration = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    expect(swRegistration).toBe(true);
  });

  test('Error handling', async ({ page }) => {
    // Test 404 page
    await page.goto('/nonexistent-page');
    await expect(page.getByText(/not found/i)).toBeVisible();
    
    // Test invalid deal ID
    await page.goto('/deal/invalid-id');
    await expect(page.getByText(/not found/i)).toBeVisible();
  });
});

