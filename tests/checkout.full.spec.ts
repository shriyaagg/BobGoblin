import { test, expect, Page } from '@playwright/test';

/**
 * Checkout Flow Regression Tests
 * 
 * Covers:
 * - Happy paths
 * - Edge cases
 * - Invalid inputs
 * - API failures
 * - Loading states
 */

// Test data
const validUser = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'United States',
};

const validPayment = {
  cardNumber: '4242424242424242',
  cardName: 'John Doe',
  expiryDate: '12/25',
  cvv: '123',
};

// Helper functions
async function addItemToCart(page: Page) {
  await page.goto('/');
 
  await page.click('[data-testid="product-item"]:first-child');
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
}

async function navigateToCheckout(page: Page) {
  await page.click('[data-testid="cart-icon"]');
  await page.click('[data-testid="checkout-button"]');
  await expect(page).toHaveURL(/.*checkout/);
}

async function fillShippingInfo(page: Page, userData = validUser) {
  await page.fill('[data-testid="email"]', userData.email);
  await page.fill('[data-testid="first-name"]', userData.firstName);
  await page.fill('[data-testid="last-name"]', userData.lastName);
  await page.fill('[data-testid="address"]', userData.address);
  await page.fill('[data-testid="city"]', userData.city);
  await page.fill('[data-testid="state"]', userData.state);
  await page.fill('[data-testid="zip-code"]', userData.zipCode);
  await page.selectOption('[data-testid="country"]', userData.country);
}

async function fillPaymentInfo(page: Page, paymentData = validPayment) {
  await page.fill('[data-testid="card-number"]', paymentData.cardNumber);
  await page.fill('[data-testid="card-name"]', paymentData.cardName);
  await page.fill('[data-testid="expiry-date"]', paymentData.expiryDate);
  await page.fill('[data-testid="cvv"]', paymentData.cvv);
}

test.describe('Checkout Flow - Happy Paths', () => {
  test.beforeEach(async ({ page }) => {
    await addItemToCart(page);
    await navigateToCheckout(page);
  });

  test('should complete checkout with valid information', async ({ page }) => {
    // Fill shipping information
    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');

    // Fill payment information
    await fillPaymentInfo(page);
    await page.click('[data-testid="place-order"]');

    // Verify order confirmation
    await expect(page).toHaveURL(/.*order-confirmation/);
    await expect(page.locator('[data-testid="order-success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
  });

  test('should allow guest checkout', async ({ page }) => {
    await page.click('[data-testid="guest-checkout"]');
    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    await fillPaymentInfo(page);
    await page.click('[data-testid="place-order"]');

    await expect(page).toHaveURL(/.*order-confirmation/);
    await expect(page.locator('[data-testid="order-success-message"]')).toBeVisible();
  });

  test('should save shipping address for future use', async ({ page }) => {
    await fillShippingInfo(page);
    await page.check('[data-testid="save-address"]');
    await page.click('[data-testid="continue-to-payment"]');
    await fillPaymentInfo(page);
    await page.click('[data-testid="place-order"]');

    await expect(page).toHaveURL(/.*order-confirmation/);
  });

  test('should apply promo code successfully', async ({ page }) => {
    await fillShippingInfo(page);
    await page.fill('[data-testid="promo-code"]', 'SAVE10');
    await page.click('[data-testid="apply-promo"]');

    await expect(page.locator('[data-testid="promo-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="discount-amount"]')).toContainText('-');
  });

  test('should display order summary correctly', async ({ page }) => {
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="subtotal"]')).toBeVisible();
    await expect(page.locator('[data-testid="shipping"]')).toBeVisible();
    await expect(page.locator('[data-testid="tax"]')).toBeVisible();
    await expect(page.locator('[data-testid="total"]')).toBeVisible();
  });
});

test.describe('Checkout Flow - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await addItemToCart(page);
    await navigateToCheckout(page);
  });

  test('should handle empty cart navigation', async ({ page }) => {
    await page.goto('/cart');
    await page.click('[data-testid="remove-item"]');
    await page.click('[data-testid="checkout-button"]');

    await expect(page.locator('[data-testid="empty-cart-message"]')).toBeVisible();
  });

  test('should handle special characters in address', async ({ page }) => {
    await fillShippingInfo(page, {
      ...validUser,
      address: "123 O'Brien St, Apt #4-B",
      city: "Saint-Jean-sur-Richelieu",
    });
    await page.click('[data-testid="continue-to-payment"]');

    await expect(page).toHaveURL(/.*payment/);
  });

  test('should handle international addresses', async ({ page }) => {
    await fillShippingInfo(page, {
      ...validUser,
      address: '10 Downing Street',
      city: 'London',
      state: 'England',
      zipCode: 'SW1A 2AA',
      country: 'United Kingdom',
    });
    await page.click('[data-testid="continue-to-payment"]');

    await expect(page).toHaveURL(/.*payment/);
  });

  test('should handle very long names', async ({ page }) => {
    await fillShippingInfo(page, {
      ...validUser,
      firstName: 'A'.repeat(50),
      lastName: 'B'.repeat(50),
    });
    await page.click('[data-testid="continue-to-payment"]');

    await expect(page).toHaveURL(/.*payment/);
  });

  test('should handle back navigation', async ({ page }) => {
    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    await page.click('[data-testid="back-to-shipping"]');

    await expect(page.locator('[data-testid="email"]')).toHaveValue(validUser.email);
  });

  test('should handle browser refresh on checkout page', async ({ page }) => {
    await fillShippingInfo(page);
    await page.reload();

    await expect(page.locator('[data-testid="email"]')).toBeVisible();
  });

  test('should handle multiple items in cart', async ({ page }) => {
    // Add more items
    await page.goto('/');
    await page.click('[data-testid="product-item"]:nth-child(2)');
    await page.click('[data-testid="add-to-cart"]');
    await navigateToCheckout(page);

    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(2);
  });
});

test.describe('Checkout Flow - Invalid Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await addItemToCart(page);
    await navigateToCheckout(page);
  });

  test('should validate required email field', async ({ page }) => {
    await page.click('[data-testid="continue-to-payment"]');

    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toContainText(/required/i);
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'invalid-email');
    await page.click('[data-testid="continue-to-payment"]');

    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toContainText(/valid email/i);
  });

  test('should validate required shipping fields', async ({ page }) => {
    await page.fill('[data-testid="email"]', validUser.email);
    await page.click('[data-testid="continue-to-payment"]');

    await expect(page.locator('[data-testid="first-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="last-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="address-error"]')).toBeVisible();
  });

  test('should validate zip code format', async ({ page }) => {
    await fillShippingInfo(page, { ...validUser, zipCode: 'INVALID' });
    await page.click('[data-testid="continue-to-payment"]');

    await expect(page.locator('[data-testid="zip-code-error"]')).toBeVisible();
  });

  test('should validate card number', async ({ page }) => {
    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    
    await page.fill('[data-testid="card-number"]', '1234');
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="card-number-error"]')).toBeVisible();
  });

  test('should validate CVV', async ({ page }) => {
    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    
    await fillPaymentInfo(page, { ...validPayment, cvv: '12' });
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="cvv-error"]')).toBeVisible();
  });

  test('should validate expiry date format', async ({ page }) => {
    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    
    await fillPaymentInfo(page, { ...validPayment, expiryDate: '13/25' });
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="expiry-error"]')).toBeVisible();
  });

  test('should validate expired card', async ({ page }) => {
    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    
    await fillPaymentInfo(page, { ...validPayment, expiryDate: '01/20' });
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="expiry-error"]')).toContainText(/expired/i);
  });

  test('should reject invalid promo code', async ({ page }) => {
    await fillShippingInfo(page);
    await page.fill('[data-testid="promo-code"]', 'INVALID123');
    await page.click('[data-testid="apply-promo"]');

    await expect(page.locator('[data-testid="promo-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="promo-error"]')).toContainText(/invalid/i);
  });
});

test.describe('Checkout Flow - API Failures', () => {
  test.beforeEach(async ({ page }) => {
    await addItemToCart(page);
    await navigateToCheckout(page);
  });

  test('should handle payment processing failure', async ({ page }) => {
    await page.route('**/api/checkout/process-payment', (route) => {
      route.fulfill({
        status: 400,
        body: JSON.stringify({ error: 'Payment declined' }),
      });
    });

    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    await fillPaymentInfo(page);
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-error"]')).toContainText(/declined/i);
  });

  test('should handle network timeout', async ({ page }) => {
    await page.route('**/api/checkout/process-payment', (route) => {
      setTimeout(() => route.abort('timedout'), 5000);
    });

    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    await fillPaymentInfo(page);
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/timeout|try again/i);
  });

  test('should handle 500 server error', async ({ page }) => {
    await page.route('**/api/checkout/process-payment', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    await fillPaymentInfo(page);
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should handle inventory check failure', async ({ page }) => {
    await page.route('**/api/checkout/validate-inventory', (route) => {
      route.fulfill({
        status: 400,
        body: JSON.stringify({ error: 'Item out of stock' }),
      });
    });

    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');

    await expect(page.locator('[data-testid="inventory-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="inventory-error"]')).toContainText(/out of stock/i);
  });

  test('should handle promo code validation API failure', async ({ page }) => {
    await page.route('**/api/checkout/validate-promo', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Service unavailable' }),
      });
    });

    await fillShippingInfo(page);
    await page.fill('[data-testid="promo-code"]', 'SAVE10');
    await page.click('[data-testid="apply-promo"]');

    await expect(page.locator('[data-testid="promo-error"]')).toBeVisible();
  });

  test('should handle shipping calculation failure', async ({ page }) => {
    await page.route('**/api/checkout/calculate-shipping', (route) => {
      route.fulfill({
        status: 400,
        body: JSON.stringify({ error: 'Cannot ship to this address' }),
      });
    });

    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');

    await expect(page.locator('[data-testid="shipping-error"]')).toBeVisible();
  });

  test('should retry failed payment on user action', async ({ page }) => {
    let attemptCount = 0;
    await page.route('**/api/checkout/process-payment', (route) => {
      attemptCount++;
      if (attemptCount === 1) {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Temporary error' }),
        });
      } else {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, orderId: '12345' }),
        });
      }
    });

    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    await fillPaymentInfo(page);
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await page.click('[data-testid="retry-payment"]');

    await expect(page).toHaveURL(/.*order-confirmation/);
  });
});

test.describe('Checkout Flow - Loading States', () => {
  test.beforeEach(async ({ page }) => {
    await addItemToCart(page);
    await navigateToCheckout(page);
  });

  test('should show loading state during payment processing', async ({ page }) => {
    await page.route('**/api/checkout/process-payment', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, orderId: '12345' }),
      });
    });

    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    await fillPaymentInfo(page);
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page.locator('[data-testid="place-order"]')).toBeDisabled();
  });

  test('should show loading state during shipping calculation', async ({ page }) => {
    await page.route('**/api/checkout/calculate-shipping', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({ shippingCost: 9.99 }),
      });
    });

    await fillShippingInfo(page);

    await expect(page.locator('[data-testid="shipping-loading"]')).toBeVisible();
  });

  test('should show loading state during promo code validation', async ({ page }) => {
    await page.route('**/api/checkout/validate-promo', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({ valid: true, discount: 10 }),
      });
    });

    await fillShippingInfo(page);
    await page.fill('[data-testid="promo-code"]', 'SAVE10');
    await page.click('[data-testid="apply-promo"]');

    await expect(page.locator('[data-testid="promo-loading"]')).toBeVisible();
    await expect(page.locator('[data-testid="apply-promo"]')).toBeDisabled();
  });

  test('should disable form during submission', async ({ page }) => {
    await page.route('**/api/checkout/process-payment', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, orderId: '12345' }),
      });
    });

    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    await fillPaymentInfo(page);
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="card-number"]')).toBeDisabled();
    await expect(page.locator('[data-testid="cvv"]')).toBeDisabled();
  });

  test('should show skeleton loader on initial page load', async ({ page }) => {
    await page.route('**/api/checkout/init', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({ cartItems: [] }),
      });
    });

    await page.goto('/checkout');

    await expect(page.locator('[data-testid="skeleton-loader"]')).toBeVisible();
  });

  test('should prevent double submission', async ({ page }) => {
    let submitCount = 0;
    await page.route('**/api/checkout/process-payment', async (route) => {
      submitCount++;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, orderId: '12345' }),
      });
    });

    await fillShippingInfo(page);
    await page.click('[data-testid="continue-to-payment"]');
    await fillPaymentInfo(page);
    
    // Try to click multiple times
    await page.click('[data-testid="place-order"]');
    await page.click('[data-testid="place-order"]');
    await page.click('[data-testid="place-order"]');

    await page.waitForURL(/.*order-confirmation/);
    expect(submitCount).toBe(1);
  });
});

test.describe('Checkout Flow - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await addItemToCart(page);
    await navigateToCheckout(page);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="first-name"]')).toBeFocused();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await expect(page.locator('[data-testid="email"]')).toHaveAttribute('aria-label');
    await expect(page.locator('[data-testid="card-number"]')).toHaveAttribute('aria-label');
  });

  test('should announce errors to screen readers', async ({ page }) => {
    await page.click('[data-testid="continue-to-payment"]');

    await expect(page.locator('[data-testid="email-error"]')).toHaveAttribute('role', 'alert');
  });
});

// Made with Bob
