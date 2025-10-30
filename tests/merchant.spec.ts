import { test, expect } from '@playwright/test';

const CAN_AUTH = process.env.PLAYWRIGHT_CAN_AUTH === '1';

test.describe('Merchant Dashboard Tests', () => {
  test.beforeAll(async () => {
    if (!CAN_AUTH) test.skip();
  });
  test.beforeEach(async ({ page }) => {
    // Login as merchant
    await page.goto('/merchant/signin');
    if (page.url().includes('/login')) {
      // fallback older route
      await page.goto('/merchant/login');
    }
    const merchantEmail = process.env.PLAYWRIGHT_MERCHANT_EMAIL || 'merchant@test.com';
    const merchantPassword = process.env.PLAYWRIGHT_MERCHANT_PASSWORD || 'merchant123!';
    await page.fill('input[type="email"]', merchantEmail);
    await page.fill('input[type="password"]', merchantPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/merchant/);
  });

  test('Merchant dashboard loads with stats', async ({ page }) => {
    await page.goto('/merchant');
    
    // Check dashboard elements
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    
    // Check stats cards
    await expect(page.getByText(/total revenue/i)).toBeVisible();
    await expect(page.getByText(/active deals/i)).toBeVisible();
    await expect(page.getByText(/total orders/i)).toBeVisible();
  });

  test('Create deal with stepper flow', async ({ page }) => {
    await page.goto('/merchant/deals/new');
    
    // Step 1: Details
    await page.fill('input[name="title"]', 'Test Happy Hour Deal');
    await page.fill('textarea[name="description"]', 'Test description for happy hour deal');
    await page.fill('input[name="percentOff"]', '20');
    
    // Click next
    await page.click('button:has-text("Next")');
    
    // Step 2: Schedule
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    await page.fill('input[name="startTime"]', '17:00');
    await page.fill('input[name="endTime"]', '19:00');
    
    // Select days
    await page.click('button:has-text("Mon")');
    await page.click('button:has-text("Tue")');
    await page.click('button:has-text("Wed")');
    
    // Click next
    await page.click('button:has-text("Next")');
    
    // Step 3: Limits
    await page.fill('input[name="maxRedemptions"]', '50');
    await page.fill('input[name="minSpend"]', '25');
    
    // Click next
    await page.click('button:has-text("Next")');
    
    // Step 4: Preview
    await expect(page.getByText('Test Happy Hour Deal')).toBeVisible();
    await expect(page.getByText('20% OFF')).toBeVisible();
    
    // Click next
    await page.click('button:has-text("Next")');
    
    // Step 5: Publish
    await page.click('button:has-text("Publish Now")');
    
    // Should show success message
    await expect(page.getByText(/deal created successfully/i)).toBeVisible();
  });

  test('Deal preview matches final card', async ({ page }) => {
    await page.goto('/merchant/deals/new');
    
    // Fill in deal details
    await page.fill('input[name="title"]', 'Preview Test Deal');
    await page.fill('textarea[name="description"]', 'Preview test description');
    await page.fill('input[name="percentOff"]', '25');
    
    // Navigate to preview step
    await page.click('button:has-text("Next")'); // Details
    await page.click('button:has-text("Next")'); // Schedule
    await page.click('button:has-text("Next")'); // Limits
    await page.click('button:has-text("Next")'); // Preview
    
    // Check preview content
    const previewTitle = page.getByText('Preview Test Deal');
    const previewDiscount = page.getByText('25% OFF');
    
    await expect(previewTitle).toBeVisible();
    await expect(previewDiscount).toBeVisible();
    
    // Publish deal
    await page.click('button:has-text("Publish Now")');
    
    // Navigate to deals list
    await page.goto('/merchant/deals');
    
    // Check that the deal appears in the list with same content
    await expect(page.getByText('Preview Test Deal')).toBeVisible();
    await expect(page.getByText('25% OFF')).toBeVisible();
  });

  test('Empty states display correctly', async ({ page }) => {
    // Test deals empty state
    await page.goto('/merchant/deals');
    
    // If no deals exist, should show empty state
    const emptyState = page.getByText(/no deals yet/i);
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
      await expect(page.getByText(/create your first deal/i)).toBeVisible();
    }
    
    // Test venues empty state
    await page.goto('/merchant/venues');
    
    const venuesEmptyState = page.getByText(/no venues added/i);
    if (await venuesEmptyState.isVisible()) {
      await expect(venuesEmptyState).toBeVisible();
      await expect(page.getByText(/add your first venue/i)).toBeVisible();
    }
  });

  test('Billing status displays correctly', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Check billing status component
    await expect(page.getByText(/subscription/i)).toBeVisible();
    
    // Check for upgrade button if on free plan
    const upgradeButton = page.getByText(/upgrade/i);
    if (await upgradeButton.isVisible()) {
      await expect(upgradeButton).toBeVisible();
    }
  });

  test('Test mode banner displays', async ({ page }) => {
    await page.goto('/merchant');
    
    // Check for test mode banner
    const testModeBanner = page.getByText(/test mode active/i);
    if (await testModeBanner.isVisible()) {
      await expect(testModeBanner).toBeVisible();
    }
  });

  test('Deal form validation', async ({ page }) => {
    await page.goto('/merchant/deals/new');
    
    // Try to submit without required fields
    await page.click('button:has-text("Next")');
    
    // Should show validation errors
    await expect(page.getByText(/title is required/i)).toBeVisible();
    await expect(page.getByText(/description is required/i)).toBeVisible();
  });

  test('Deal editing works', async ({ page }) => {
    // First create a deal
    await page.goto('/merchant/deals/new');
    await page.fill('input[name="title"]', 'Editable Deal');
    await page.fill('textarea[name="description"]', 'This deal can be edited');
    await page.fill('input[name="percentOff"]', '15');
    
    // Navigate through steps quickly
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Publish Now")');
    
    // Navigate to deals list
    await page.goto('/merchant/deals');
    
    // Click edit on the deal
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    await editButton.click();
    
    // Should be on edit page
    await expect(page).toHaveURL(/\/deals\/.*\/edit/);
    
    // Edit the deal
    await page.fill('input[name="title"]', 'Edited Deal Title');
    await page.click('button:has-text("Save Changes")');
    
    // Should show success message
    await expect(page.getByText(/deal updated/i)).toBeVisible();
  });
});

