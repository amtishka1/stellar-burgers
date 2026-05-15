import { test, expect, Page } from '@playwright/test';
import { mockBun, mockMain, mockSauce, mockOrder } from './mockData';

const BASE_URL = 'http://localhost:4000';

test.describe('Burger Constructor Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Adding ingredients to constructor', () => {
    test('should add bun ingredient to constructor', async ({ page }) => {
      const addButtons = page.getByRole('button', { name: 'Добавить' });
      await addButtons.first().click();

      await expect(page.getByText(`${mockBun.name} (верх)`)).toBeVisible();
      await expect(page.getByText(`${mockBun.name} (низ)`)).toBeVisible();
    });

    test('should add main ingredient to constructor', async ({ page }) => {
      const addButtons = page.getByRole('button', { name: 'Добавить' });
      await addButtons.nth(1).click();

      await expect(page.getByText(mockMain.name).first()).toBeVisible();
    });

    test('should add sauce ingredient to constructor', async ({ page }) => {
      const addButtons = page.getByRole('button', { name: 'Добавить' });
      await addButtons.nth(2).click();

      await expect(page.getByText(mockSauce.name).first()).toBeVisible();
    });
  });

  test.describe('Ingredient modal', () => {
    test('should open modal on ingredient click', async ({ page }) => {
      const ingredientLink = page
        .locator('a')
        .filter({ hasText: mockBun.name });
      await ingredientLink.first().click();

      await expect(page.getByText('Детали ингредиента')).toBeVisible();
      await expect(
        page.getByRole('heading', { name: mockBun.name })
      ).toBeVisible();
    });

    test('should close modal by clicking close button', async ({ page }) => {
      await page
        .locator('a')
        .filter({ hasText: mockBun.name })
        .first()
        .click();
      await expect(page.getByText('Детали ингредиента')).toBeVisible();

      await page
        .locator('#modals button')
        .filter({ has: page.locator('svg') })
        .click();
      await expect(
        page.getByText('Детали ингредиента')
      ).not.toBeVisible();
    });

    test('should close modal by clicking overlay', async ({ page }) => {
      await page
        .locator('a')
        .filter({ hasText: mockSauce.name })
        .first()
        .click();
      await expect(page.getByText('Детали ингредиента')).toBeVisible();

      await page
        .locator('#modals > div')
        .last()
        .click({ position: { x: 10, y: 10 } });
      await expect(
        page.getByText('Детали ингредиента')
      ).not.toBeVisible();
    });

    test('should display correct ingredient data in modal', async ({
      page
    }) => {
      await page
        .locator('a')
        .filter({ hasText: mockSauce.name })
        .first()
        .click();

      await expect(
        page.getByRole('heading', { name: mockSauce.name })
      ).toBeVisible();
      await expect(page.getByText(String(mockSauce.price))).toBeVisible();
    });
  });

  test.describe('Order creation', () => {
    test.beforeEach(async ({ page }) => {
      await page.routeFromHAR('tests/hars/order.har', {
        url: '**/api/orders'
      });
      await page.routeFromHAR('tests/hars/order.har', {
        url: '**/api/auth/user'
      });

      await page.evaluate(() => {
        document.cookie = 'accessToken=test-access-token; path=/';
        localStorage.setItem('refreshToken', 'test-refresh-token');
      });

      await page.reload();
      await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
      await page.evaluate(() => {
        document.cookie =
          'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('refreshToken');
      });
    });

    test('should create order and show order number then close modal', async ({
      page
    }) => {
      const addButtons = page.getByRole('button', { name: 'Добавить' });
      await addButtons.first().click();
      await addButtons.nth(1).click();

      await page.getByText('Оформить заказ').click();

      await expect(
        page.getByText(String(mockOrder.number))
      ).toBeVisible();

      await page
        .locator('#modals button')
        .filter({ has: page.locator('svg') })
        .click();
      await expect(
        page.getByText(String(mockOrder.number))
      ).not.toBeVisible();
    });

    test('should clear constructor after order', async ({ page }) => {
      const addButtons = page.getByRole('button', { name: 'Добавить' });
      await addButtons.first().click();
      await addButtons.nth(1).click();

      await page.getByText('Оформить заказ').click();

      await expect(
        page.getByText(String(mockOrder.number))
      ).toBeVisible();

      await page
        .locator('#modals button')
        .filter({ has: page.locator('svg') })
        .click();

      await expect(page.getByText('Выберите булки').first()).toBeVisible();
      await expect(page.getByText('Выберите начинку')).toBeVisible();
    });
  });
});
