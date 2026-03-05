import { test, expect } from '@playwright/test';

test('home page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/HMS/);
    await expect(page.getByText('Hospital Management System')).toBeVisible();
});

test('navigation to login works', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/auth/login');
});
