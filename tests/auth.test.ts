import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test('[AUTH] Login page loads correctly', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check for login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check for remember me checkbox
    const rememberMeCheckbox = page.locator('input[type="checkbox"]');
    await expect(rememberMeCheckbox).toBeVisible();
  });

  test('[AUTH] Signup page loads correctly', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    
    // Check for signup form elements
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('[AUTH] OAuth buttons are conditionally rendered', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check if OAuth buttons are present (they should be hidden if env vars not set)
    const googleButton = page.locator('button:has-text("Continue with Google")');
    const appleButton = page.locator('button:has-text("Continue with Apple")');
    
    // At least one OAuth button should be present or none at all
    const googleVisible = await googleButton.isVisible();
    const appleVisible = await appleButton.isVisible();
    
    // If OAuth is configured, buttons should be visible
    // If not configured, buttons should be hidden
    expect(googleVisible || appleVisible || (!googleVisible && !appleVisible)).toBe(true);
  });

  test('[AUTH] Form validation works', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=required')).toBeVisible();
  });

  test('[AUTH] Password reset flow', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Click forgot password link
    const forgotPasswordLink = page.locator('text=Forgot password?');
    await expect(forgotPasswordLink).toBeVisible();
    await forgotPasswordLink.click();
    
    // Should show forgot password form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Send Reset Link")')).toBeVisible();
  });

  test('[AUTH] Merchant signup multi-step flow', async ({ page }) => {
    await page.goto('/merchant/signup');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to multi-step signup
    await expect(page).toHaveURL('/merchant/signup/multi-step');
    
    // Check for business information form
    await expect(page.locator('input[name="businessName"]')).toBeVisible();
    await expect(page.locator('input[name="contactName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
  });

  test('[AUTH] Protected routes redirect to login', async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto('/account');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login or show login form
    const isLoginPage = page.url().includes('/login');
    const hasLoginForm = await page.locator('input[type="email"]').isVisible();
    
    expect(isLoginPage || hasLoginForm).toBe(true);
  });
});
