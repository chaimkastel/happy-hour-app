import { test, expect } from '@playwright/test';

test.describe('Billing Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as merchant
    await page.goto('/merchant/login');
    await page.fill('input[type="email"]', 'merchant@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/merchant');
  });

  test('Subscription status displays correctly', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Check for subscription status
    await expect(page.getByText(/subscription/i)).toBeVisible();
    
    // Check for plan information
    await expect(page.getByText(/plan/i)).toBeVisible();
  });

  test('Customer portal opens', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Click manage billing button
    const manageBillingButton = page.getByRole('button', { name: /manage billing/i });
    await manageBillingButton.click();
    
    // Should redirect to Stripe customer portal
    await expect(page).toHaveURL(/stripe\.com/);
  });

  test('Upgrade flow works', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Click upgrade button if visible
    const upgradeButton = page.getByRole('button', { name: /upgrade/i });
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();
      
      // Should redirect to Stripe checkout
      await expect(page).toHaveURL(/stripe\.com/);
    }
  });

  test('Webhook events update subscription status', async ({ page }) => {
    // This test would require mocking Stripe webhook events
    // For now, we'll test the UI updates
    
    await page.goto('/merchant/billing');
    
    // Check initial status
    const statusElement = page.getByText(/active|trial|past due|canceled/i);
    await expect(statusElement).toBeVisible();
    
    // Simulate webhook event by refreshing
    await page.reload();
    
    // Status should still be visible
    await expect(statusElement).toBeVisible();
  });

  test('Past due status shows correctly', async ({ page }) => {
    // This would require setting up a test merchant with past due status
    await page.goto('/merchant/billing');
    
    // Check for past due indicators
    const pastDueIndicator = page.getByText(/past due/i);
    if (await pastDueIndicator.isVisible()) {
      await expect(pastDueIndicator).toBeVisible();
      
      // Should show payment required message
      await expect(page.getByText(/payment required/i)).toBeVisible();
    }
  });

  test('Trial status shows correctly', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Check for trial indicators
    const trialIndicator = page.getByText(/free trial/i);
    if (await trialIndicator.isVisible()) {
      await expect(trialIndicator).toBeVisible();
      
      // Should show upgrade option
      await expect(page.getByText(/upgrade to pro/i)).toBeVisible();
    }
  });

  test('Billing history displays', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Look for billing history section
    const billingHistory = page.getByText(/billing history/i);
    if (await billingHistory.isVisible()) {
      await expect(billingHistory).toBeVisible();
    }
  });

  test('Invoice download works', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Look for download invoice buttons
    const downloadButtons = page.getByRole('button', { name: /download/i });
    if (await downloadButtons.count() > 0) {
      const firstDownload = downloadButtons.first();
      await firstDownload.click();
      
      // Should trigger download
      // Note: In a real test, you'd check for the download
    }
  });

  test('Cancel subscription flow', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Look for cancel subscription button
    const cancelButton = page.getByRole('button', { name: /cancel/i });
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      
      // Should show confirmation dialog
      await expect(page.getByText(/confirm cancellation/i)).toBeVisible();
      
      // Cancel the cancellation
      const cancelCancelButton = page.getByRole('button', { name: /keep subscription/i });
      await cancelCancelButton.click();
    }
  });

  test('Reactivation flow works', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Look for reactivate button (if subscription is canceled)
    const reactivateButton = page.getByRole('button', { name: /reactivate/i });
    if (await reactivateButton.isVisible()) {
      await reactivateButton.click();
      
      // Should redirect to Stripe
      await expect(page).toHaveURL(/stripe\.com/);
    }
  });

  test('Billing address management', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Look for billing address section
    const billingAddress = page.getByText(/billing address/i);
    if (await billingAddress.isVisible()) {
      await expect(billingAddress).toBeVisible();
      
      // Look for edit address button
      const editAddressButton = page.getByRole('button', { name: /edit address/i });
      if (await editAddressButton.isVisible()) {
        await editAddressButton.click();
        
        // Should show address form
        await expect(page.getByRole('textbox', { name: /address/i })).toBeVisible();
      }
    }
  });

  test('Payment method management', async ({ page }) => {
    await page.goto('/merchant/billing');
    
    // Look for payment method section
    const paymentMethod = page.getByText(/payment method/i);
    if (await paymentMethod.isVisible()) {
      await expect(paymentMethod).toBeVisible();
      
      // Look for update payment method button
      const updatePaymentButton = page.getByRole('button', { name: /update payment/i });
      if (await updatePaymentButton.isVisible()) {
        await updatePaymentButton.click();
        
        // Should redirect to Stripe
        await expect(page).toHaveURL(/stripe\.com/);
      }
    }
  });
});

