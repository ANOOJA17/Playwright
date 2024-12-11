const { test, expect } = require('@playwright/test');

test.describe('Checkout functionality', () => {
    test('should complete the checkout process successfully', async ({ page }) => {
        // Step 1: Visit the website
        await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');

        // Step 2: Add some items to the cart
        await page.locator('text=Brocolli - 1 Kg').click();
        await page.locator('text=ADD TO CART').first().click();
        await page.locator('text=Cauliflower - 1 Kg').click();
        await page.locator('text=ADD TO CART').nth(1).click();

        // Step 3: Click on the cart icon
        await page.locator('.cart-icon').click();

        // Step 4: Proceed to checkout
        await page.locator('text=PROCEED TO CHECKOUT').click();

        // Step 5: Apply the promo code 'rahulshettyacademy'
        await page.locator('input.promoCode').fill('rahulshettyacademy');
        await page.locator('text=Apply').click();
        await page.waitForSelector('.promoInfo', { state: 'visible' });

        // Step 6: Place the order
        await page.locator('text=Place Order').click();

        // Step 7: Give country value as Australia and click on the checkbox
        await page.locator('select').selectOption('Australia');
        await page.locator('input.chkAgree').check();
        await page.locator('text=Proceed').click();

        // Step 8: Assert whether 'Thank you, your order has been placed successfully' text is visible
        await expect(page.locator('text=Thank you, your order has been placed successfully')).toBeVisible();

        // Step 9: The URL should navigate back to home after 6 seconds
        await page.waitForTimeout(6000);
        await expect(page).toHaveURL('https://rahulshettyacademy.com/seleniumPractise/#/');
    });
    
    // Should display the error message 'Invalid code ..!' when an invalid promo code is applied.
    test('should display the error message when an invalid promo code is applied', async ({ page }) => {
        // Step 1: Visit the website
        await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');

        // Step 2: Add some items to the cart
        await page.locator('text=Brocolli - 1 Kg').click();
        await page.locator('text=ADD TO CART').first().click();
        await page.locator('text=Cauliflower - 1 Kg').click();
        await page.locator('text=ADD TO CART').nth(1).click();

        // Step 3: Click on the cart icon
        await page.locator('.cart-icon').click();

        // Step 4: Proceed to checkout
        await page.locator('text=PROCEED TO CHECKOUT').click();

        // Step 5: Apply the promo code 'rahulshettyacademy'
        await page.locator('input.promoCode').fill('invalidcode');
        await page.locator('text=Apply').click();
        await page.waitForSelector('.promoInfo', { state: 'visible' });

        // Step 6: Assert whether 'Invalid code ..!' text is visible
        await expect(page.locator('text=Invalid code ..!')).toBeVisible();
    });
});


