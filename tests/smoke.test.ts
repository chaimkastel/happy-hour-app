import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/OrderHappyHour/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('login page loads successfully', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('signup page loads successfully', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveTitle(/Sign Up/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('explore page loads successfully', async ({ page }) => {
    await page.goto('/explore');
    await expect(page).toHaveTitle(/Explore/);
  });

  test('merchant login page loads successfully', async ({ page }) => {
    await page.goto('/merchant/login');
    await expect(page).toHaveTitle(/Merchant Login/);
  });

  test('admin access page loads successfully', async ({ page }) => {
    await page.goto('/admin-access');
    await expect(page).toHaveTitle(/Admin Access/);
  });

  test('protected routes redirect to login', async ({ page }) => {
    // Test merchant dashboard redirect
    await page.goto('/merchant/dashboard');
    await expect(page).toHaveURL(/.*login/);
    
    // Test admin dashboard redirect
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/.*admin-access/);
    
    // Test account redirect
    await page.goto('/account');
    await expect(page).toHaveURL(/.*login/);
  });
});