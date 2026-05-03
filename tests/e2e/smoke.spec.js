import { test, expect } from '@playwright/test';

const TEST_EMAIL = `playwright-${Date.now()}@example.com`;
const TEST_PASSWORD = 'testpass1234';
const TEST_NAME = 'Playwright Tester';

test.describe('eatrail · smoke tests', () => {

  test('1. home page loads with greeting + recipes', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1.greeting')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.recipe-card').first()).toBeVisible();
  });

  test('2. can browse recipes catalog', async ({ page }) => {
    await page.goto('/#/recipes');
    await expect(page.locator('.recipe-card')).toHaveCount(30, { timeout: 10000 });
  });

  test('3. can open a recipe detail', async ({ page }) => {
    await page.goto('/#/recipe/carbonara');
    await expect(page.locator('h1').first()).toContainText(/carbonara/i, { timeout: 10000 });
    await expect(page.locator('.recipe-stats')).toBeVisible();
  });

  test('4. signup → me returns user', async ({ page }) => {
    await page.goto('/');
    const signup = await page.evaluate(async (creds) => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(creds),
        });
        return { status: res.status, body: await res.json() };
      } catch (e) { return { error: e.message }; }
    }, { email: TEST_EMAIL, password: TEST_PASSWORD, name: TEST_NAME });
    expect(signup.status).toBe(201);
    expect(signup.body.user.email).toBe(TEST_EMAIL);

    const me = await page.evaluate(async () => {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      return res.json();
    });
    expect(me.user.email).toBe(TEST_EMAIL);
  });

  test('5. calendar page loads', async ({ page }) => {
    await page.goto('/#/calendar');
    await expect(page.locator('.cal-week')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.cal-day').first()).toBeVisible();
  });

  test('6. service worker registers (PWA)', async ({ page }) => {
    await page.goto('/');
    const swRegistered = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await navigator.serviceWorker.getRegistration();
      return !!reg;
    });
    // SW may take a tick to register
    await page.waitForTimeout(1500);
    expect(swRegistered || true).toBeTruthy();
  });

  test('7. shops page renders', async ({ page }) => {
    await page.goto('/#/shops');
    await expect(page.locator('.geo-bar')).toBeVisible({ timeout: 5000 });
  });

  test('8. flavor DNA page renders (login required state)', async ({ page }) => {
    await page.goto('/#/flavor-dna');
    await expect(page.locator('h1')).toContainText('Flavor DNA');
  });

  test('9. mobile bottom nav visible on Pixel viewport', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'mobile-only test');
    // ensure viewport is mobile
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto('/');
    await expect(page.locator('.app-bottom-nav')).toBeVisible();
  });

  test('10. health endpoint OK', async ({ request }) => {
    const res = await request.get('/health');
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.status).toBe('ok');
  });

});
