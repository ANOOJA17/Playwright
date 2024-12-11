// @ts-check
import { test, expect } from '@playwright/test';

test('should mock /api/v1/fruits and add some fruits',  async ({ page }) => {
    // Intercept the API request and mock the response
    await page.route('**/api/v1/fruits', route => {
        const jsonResponse = JSON.stringify([
            { name: "Pappaya", id: 3 },
            { name: "Grapes", id: 1 },
            { name: "Pomegranate", id: 5 },
            { name: "Guava", id: 4 },
        ]);
        route.fulfill({
            contentType: 'application/json',
            body: jsonResponse // Convert the object to a JSON string
        });
    });

    // Navigate to the page that makes the API call
    await page.goto('https://demo.playwright.dev/api-mocking/');

    // Check if all 5 fruit names are visible
    const fruits = ['Pappaya', 'Grapes', 'Pomegranate', 'Guava'];
    for (const fruit of fruits) {
        await expect(page.locator(`text=${fruit}`)).toBeVisible();
    }
});


test('should modify /api/v1/fruits response and add Jackfruit', async ({ page }) => {
    let originalResponse;

    // Intercept the API request and save the original response
    await page.route('**/api/v1/fruits', async route => {
        const response = await route.fetch();
        originalResponse = await response.json();

        // Modify the response by adding 'Jackfruit' as the 21st fruit
        const modifiedResponse = [
            { name: "Jackfruit", id: 21 },
            ...originalResponse
        ];

        // Fulfill the route with the modified response
        route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify(modifiedResponse)
        });
    });

    // Navigate to the page that makes the API call
    await page.goto('https://demo.playwright.dev/api-mocking/');

    // Check if the newly added fruit name is visible
    await expect(page.locator('text=Jackfruit')).toBeVisible();
});

