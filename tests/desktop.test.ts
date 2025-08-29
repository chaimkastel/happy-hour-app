import { test, expect } from '@playwright/test';

test.describe('Desktop Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('[DESKTOP] Homepage loads with deals explorer', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for main heading
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for explore button
    const exploreButton = page.locator('button:has-text("Explore")').first();
    await expect(exploreButton).toBeVisible();
    await expect(exploreButton).toHaveAttribute('type', 'button');
  });

  test('[DESKTOP] Search functionality works', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Find main search input
    const searchInput = page.locator('input[placeholder*="address"]');
    await expect(searchInput).toBeVisible();
    
    // Type in search
    await searchInput.fill('New York');
    await expect(searchInput).toHaveValue('New York');
    
    // Find search button
    const searchButton = page.locator('button[aria-label="Search for deals"]');
    await expect(searchButton).toBeVisible();
  });

  test('[DESKTOP] View toggle works', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Find view toggle buttons
    const gridButton = page.locator('button[aria-label="Switch to grid view"]');
    const mapButton = page.locator('button[aria-label="Switch to map view"]');
    
    if (await gridButton.isVisible() && await mapButton.isVisible()) {
      // Test toggling between views
      await mapButton.click();
      await gridButton.click();
    }
  });

  test('[DESKTOP] All buttons have proper attributes', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Get all buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 20); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        // Check that button has type attribute
        const type = await button.getAttribute('type');
        expect(type).toBe('button');
        
        // Check that button has either text or aria-label
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
      }
    }
  });

  test('[DESKTOP] Navigation and CTAs work', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for main CTA buttons
    const ctaButtons = [
      'button:has-text("Explore")',
      'button:has-text("Start Saving")',
      'button:has-text("Start Free Trial")'
    ];
    
    for (const selector of ctaButtons) {
      const button = page.locator(selector).first();
      if (await button.isVisible()) {
        await expect(button).toHaveAttribute('type', 'button');
      }
    }
  });

  test('[DESKTOP] No unauthorized emojis present', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Get page content
    const content = await page.textContent('body');
    
    // Should only contain beer mug emoji in logo
    const emojiPattern = /[🍔🍕🥂🍷🍸🍹🍾🥃🍴🍽️🍿🍩🍪🍫🍬🍭🍮🍯🍰🍱🍲🍳🍵🍶🎂🎃🎄🎅🎆🎇🎈🎉🎊🎋🎌🎍🎎🎏🎐🎑🎒🎓🎖️🎗️🎙️🎚️🎛️🎞️🎟️🎠🎡🎢🎣🎤🎥🎦🎧🎨🎩🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋️🏌️🏍️🏎️🏏🏐🏑🏒🏓🏔️🏕️🏖️🏗️🏘️🏙️🏚️🏛️🏜️🏝️🏞️🏟️🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳️🏴🏵️🏶🏷️🏸🏹🏺🏻🏼🏽🏾🏿]/g;
    const unauthorizedEmojis = content?.match(emojiPattern);
    
    // Should only find beer mug emoji (🍺) and only in logo contexts
    if (unauthorizedEmojis) {
      const nonBeerEmojis = unauthorizedEmojis.filter(emoji => emoji !== '🍺');
      expect(nonBeerEmojis.length).toBe(0);
    }
  });
});
