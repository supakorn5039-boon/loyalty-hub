import { test, expect } from '@playwright/test';

test.describe('LoyaltyHub E2E Test Suite', () => {
  test('should load web-first SaaS responsive portal layout', async ({ page }) => {
    await page.goto('/');

    // Check header and main dashboard text
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText('Store Manager Admin Console')).toBeVisible();

    // Verify system KPI cards
    await expect(page.getByText('Total Members')).toBeVisible();
    await expect(page.getByText('Points Issued')).toBeVisible();
    await expect(page.getByText('GMV Sales Volume')).toBeVisible();
  });

  test('should switch tabs seamlessly', async ({ page }) => {
    await page.goto('/');

    const isMobile = page.viewportSize() && page.viewportSize()!.width < 1024;
    const navSelector = isMobile ? 'nav.fixed button' : 'aside button';

    // Switch to Rewards tab
    await page.locator(navSelector).filter({ hasText: /rewards/i }).first().click();
    await expect(page.locator('main').getByText(/Rewards Catalog/i)).toBeVisible();

    // Switch to Coupons tab
    await page.locator(navSelector).filter({ hasText: /coupon|voucher/i }).first().click();
    await expect(page.locator('main').getByText(/Voucher Wallet/i)).toBeVisible();

    // Switch to Statement tab
    await page.locator(navSelector).filter({ hasText: /statement|audit/i }).first().click();
    await expect(page.locator('main').getByText(/Audit Statement/i)).toBeVisible();

    // Switch to Admin Dashboard tab
    await page.locator(navSelector).filter({ hasText: /dashboard|admin/i }).first().click();
    await expect(page.getByText(/Store Manager Admin Console/i)).toBeVisible();
  });
});
