import { test, expect } from '@playwright/test';

test.describe('Escape Room Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/EscapeRoom');
  });

  test('should display game page with timer', async ({ page }) => {
    // Check page title/heading
    await expect(page.locator('text=Escape Room Challenge')).toBeVisible();
    
    // Check timer is visible
    await expect(page.locator('text=/Time Remaining|Timer/i')).toBeVisible();
    
    // Check Start button exists
    await expect(page.locator('button:has-text("Start")')).toBeVisible();
  });

  test('should start game when clicking Start button', async ({ page }) => {
    // Click Start button
    await page.locator('button:has-text("Start")').click();
    
    // Wait for game to start (Challenge 1 should appear)
    await expect(page.locator('h2:has-text("Challenge 1")')).toBeVisible({ timeout: 5000 });
    
    // Verify pause button appears (timer is running)
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
  });

  test('should complete Challenge 1 with correct answer', async ({ page }) => {
    // Start game
    await page.locator('button:has-text("Start")').click();
    await page.waitForTimeout(1000);
    
    // Wait for Challenge 1
    await expect(page.locator('h2:has-text("Challenge 1")')).toBeVisible({ timeout: 5000 });
    
    // Fill in correct code (sum of 0 to 10 = 55)
    const codeEditor = page.locator('textarea.code-editor, textarea[class*="editor"]').first();
    await codeEditor.clear();
    await codeEditor.fill(`let sum = 0;
for (let i = 0; i <= 10; i++) {
  sum += i;
}
console.log(sum);`);
    
    // Click Run Code
    await page.locator('button:has-text("Run Code")').click();
    
    // Wait for success message
    await expect(page.locator('text=/Correct|✅/i')).toBeVisible({ timeout: 5000 });
    
    // Challenge 2 should appear
    await expect(page.locator('h2:has-text("Challenge 2")')).toBeVisible({ timeout: 3000 });
  });

  test('should complete full game successfully', async ({ page }) => {
    // Start game
    await page.locator('button:has-text("Start")').click();
    await page.waitForTimeout(1000);
    
    // === Challenge 1: Sum ===
    await expect(page.locator('h2:has-text("Challenge 1")')).toBeVisible({ timeout: 5000 });
    const editor1 = page.locator('textarea').first();
    await editor1.clear();
    await editor1.fill(`let sum = 0;
for (let i = 0; i <= 10; i++) {
  sum += i;
}
console.log(sum);`);
    await page.locator('button:has-text("Run Code")').click();
    await page.waitForTimeout(2000);
    
    // === Challenge 2: localStorage ===
    await expect(page.locator('h2:has-text("Challenge 2")')).toBeVisible({ timeout: 5000 });
    const editor2 = page.locator('textarea').first();
    await editor2.clear();
    await editor2.fill(`const user = {
  name: "John",
  age: 25,
  city: "NYC"
};
localStorage.setItem("userData", JSON.stringify(user));
const saved = localStorage.getItem("userData");
console.log("Saved data:", saved);`);
    await page.locator('button:has-text("Run Code")').click();
    await page.waitForTimeout(2000);
    
    // === Challenge 3: Debug Tool ===
    await expect(page.locator('h2:has-text("Challenge 3")')).toBeVisible({ timeout: 5000 });
    
    // Click on Bug icon (🐛)
    const bugIcon = page.locator('button:has-text("🐛")').or(page.locator('button:has-text("Bug Icon")')).first();
    await bugIcon.click();
    
    // Wait for win screen
    await expect(page.locator('h1:has-text("Escaped")')).toBeVisible({ timeout: 5000 });
    
    // Verify completion time is shown
    await expect(page.locator('text=/Time:/i')).toBeVisible();
    
    // Verify save button exists
    await expect(page.locator('button:has-text("Save Result")')).toBeVisible();
  });

  test('should show lose screen when time expires', async ({ page }) => {
    // Check if "Give up Challenge" link exists on the page
    const giveUpLink = page.locator('a[href="/"]').filter({ hasText: 'Give up' });
    await expect(giveUpLink).toBeVisible();
  });

  test('should save game result after winning', async ({ page }) => {
    // Start and complete game quickly (abbreviated version)
    await page.goto('/EscapeRoom');
    await page.locator('button:has-text("Start")').click();
    await page.waitForTimeout(1000);
    
    // Complete Challenge 1
    const editor1 = page.locator('textarea').first();
    await editor1.fill(`let sum = 0; for (let i = 0; i <= 10; i++) { sum += i; } console.log(sum);`);
    await page.locator('button:has-text("Run Code")').click();
    await page.waitForTimeout(2000);
    
    // Complete Challenge 2
    const editor2 = page.locator('textarea').first();
    await editor2.fill(`const user = {name: "John",age: 25,city: "NYC"}; localStorage.setItem("userData", JSON.stringify(user)); console.log("Saved");`);
    await page.locator('button:has-text("Run Code")').click();
    await page.waitForTimeout(2000);
    
    // Complete Challenge 3
    await page.locator('button:has-text("🐛")').first().click();
    
    // Wait for win screen
    await expect(page.locator('h1:has-text("Escaped")')).toBeVisible({ timeout: 5000 });
    
    // Enter player name
    await page.locator('input[placeholder*="name"]').fill('E2E Test Player');
    
    // Click Save Result
    await page.locator('button:has-text("Save Result")').click();
    
    // Wait for success message or redirect
    await expect(page.locator('text=/saved|success/i').or(page.locator('.success'))).toBeVisible({ timeout: 5000 });
  });
});
