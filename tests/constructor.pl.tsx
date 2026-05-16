import { test, expect, Page, Locator } from '@playwright/test';
import { mockBun, mockMain, mockSauce, mockOrder } from './mockData';

const constructorSection = (page: Page): Locator =>
  page.locator('section').filter({ hasText: 'Оформить заказ' });

const modal = (page: Page): Locator => page.locator('#modals');

test.describe('Burger Constructor Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Adding ingredients to constructor', () => {
    test('should add bun ingredient to constructor', async ({ page }) => {
      await page
        .getByTestId(`ingredient-${mockBun._id}`)
        .getByRole('button', { name: 'Добавить' })
        .click();

      await expect(
        constructorSection(page).getByText(`${mockBun.name} (верх)`)
      ).toBeVisible();
      await expect(
        constructorSection(page).getByText(`${mockBun.name} (низ)`)
      ).toBeVisible();
    });

    test('should add main ingredient to constructor', async ({ page }) => {
      await page
        .getByTestId(`ingredient-${mockMain._id}`)
        .getByRole('button', { name: 'Добавить' })
        .click();

      await expect(
        constructorSection(page).getByText(mockMain.name)
      ).toBeVisible();
    });

    test('should add sauce ingredient to constructor', async ({ page }) => {
      await page
        .getByTestId(`ingredient-${mockSauce._id}`)
        .getByRole('button', { name: 'Добавить' })
        .click();

      await expect(
        constructorSection(page).getByText(mockSauce.name)
      ).toBeVisible();
    });
  });

  test.describe('Ingredient modal', () => {
    test('should open modal on ingredient click', async ({ page }) => {
      await page
        .getByTestId(`ingredient-${mockBun._id}`)
        .getByRole('link')
        .click();

      await expect(modal(page).getByText('Детали ингредиента')).toBeVisible();
      await expect(
        modal(page).getByRole('heading', { name: mockBun.name })
      ).toBeVisible();
    });

    test('should close modal by clicking close button', async ({ page }) => {
      await page
        .getByTestId(`ingredient-${mockBun._id}`)
        .getByRole('link')
        .click();
      await expect(modal(page).getByText('Детали ингредиента')).toBeVisible();

      await page
        .locator('#modals button')
        .filter({ has: page.locator('svg') })
        .click();
      await expect(
        modal(page).getByText('Детали ингредиента')
      ).not.toBeVisible();
    });

    test('should close modal by clicking overlay', async ({ page }) => {
      await page
        .getByTestId(`ingredient-${mockSauce._id}`)
        .getByRole('link')
        .click();
      await expect(modal(page).getByText('Детали ингредиента')).toBeVisible();

      await page
        .locator('#modals > div')
        .last()
        .click({ position: { x: 10, y: 10 } });
      await expect(
        modal(page).getByText('Детали ингредиента')
      ).not.toBeVisible();
    });

    test('should display correct ingredient data in modal', async ({
      page
    }) => {
      await page
        .getByTestId(`ingredient-${mockSauce._id}`)
        .getByRole('link')
        .click();

      await expect(
        modal(page).getByRole('heading', { name: mockSauce.name })
      ).toBeVisible();
      await expect(
        modal(page).getByText(String(mockSauce.calories)).first()
      ).toBeVisible();
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
      await page
        .getByTestId(`ingredient-${mockBun._id}`)
        .getByRole('button', { name: 'Добавить' })
        .click();
      await page
        .getByTestId(`ingredient-${mockMain._id}`)
        .getByRole('button', { name: 'Добавить' })
        .click();

      await page.getByText('Оформить заказ').click();

      await expect(
        modal(page).getByText(String(mockOrder.number))
      ).toBeVisible();

      await page
        .locator('#modals button')
        .filter({ has: page.locator('svg') })
        .click();
      await expect(
        modal(page).getByText(String(mockOrder.number))
      ).not.toBeVisible();
    });

    test('should clear constructor after order', async ({ page }) => {
      await page
        .getByTestId(`ingredient-${mockBun._id}`)
        .getByRole('button', { name: 'Добавить' })
        .click();
      await page
        .getByTestId(`ingredient-${mockMain._id}`)
        .getByRole('button', { name: 'Добавить' })
        .click();

      await page.getByText('Оформить заказ').click();

      await expect(
        modal(page).getByText(String(mockOrder.number))
      ).toBeVisible();

      await page
        .locator('#modals button')
        .filter({ has: page.locator('svg') })
        .click();

      await expect(
        constructorSection(page).getByText('Выберите булки').first()
      ).toBeVisible();
      await expect(
        constructorSection(page).getByText('Выберите начинку')
      ).toBeVisible();
    });
  });
});
