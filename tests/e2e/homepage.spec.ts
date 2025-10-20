import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/CSE3CWA/i);
    
    // Check main heading exists
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should navigate to Escape Room', async ({ page }) => {
    await page.goto('/');
    
    // Find and click Escape Room link/button
    const escapeRoomLink = page.locator('a[href*="EscapeRoom"], button:has-text("Escape Room")').first();
    await expect(escapeRoomLink).toBeVisible();
    await escapeRoomLink.click();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*EscapeRoom/);
    
    // Verify Escape Room page loaded
    await expect(page.locator('text=Escape Room Challenge')).toBeVisible();
  });

  test('should display navbar', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation elements
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
  });
});
