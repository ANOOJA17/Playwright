import { expect, test } from '@playwright/test';

// Constants for selectors
const DATE_PICKER_INPUT = '#datepicker input';
const DATE_PICKER_SWITCH = '.datepicker-switch';
const DATE_PICKER_PREV = '.datepicker-years .prev';
const DATE_PICKER_NEXT = '.datepicker-years .next';
const DATE_PICKER_YEAR = '.datepicker-years .year';
const DATE_PICKER_MONTH = '.datepicker-months .month';
const DATE_PICKER_DAY = '[class="day"]';

// Helper function to format date
async function getDate(year, month, day) {
    if (parseInt(month) < 10) {
        month = '0' + month;
    }
    if (parseInt(day) < 10) {
        day = '0' + day;
    }
    return `${month}-${day}-${year}`;
}

// Helper function to navigate to the correct year
async function selectYear(page, year) {
    let range = await page.locator('.datepicker-years ' + DATE_PICKER_SWITCH).textContent();
    if (range) {
        let lower = parseInt(range.split('-')[0]);
        let upper = parseInt(range.split('-')[1]);
        while (!((parseInt(year) >= lower) && (parseInt(year) <= upper))) {
            if (parseInt(year) < lower) {
                await page.locator(DATE_PICKER_PREV).click();
            } else if (parseInt(year) > upper) {
                await page.locator(DATE_PICKER_NEXT).click();
            }
            range = await page.locator('.datepicker-years ' + DATE_PICKER_SWITCH).textContent();
            if (range) {
                lower = parseInt(range.split('-')[0]);
                upper = parseInt(range.split('-')[1]);
            }
        }
    }
    await page.locator(`${DATE_PICKER_YEAR}:has-text("${year}")`).click();
}

// Main test
test('Date Picker', async ({ page }) => {
    await page.goto('https://www.webdriveruniversity.com/Datepicker/index.html');
    const year = '2089';
    const month = '2';
    const day = '9';
    const date = await getDate(year, month, day);

    // Open date picker
    await page.locator(DATE_PICKER_INPUT).first().click();

    // Navigate to year view
    await page.locator('.datepicker-days ' + DATE_PICKER_SWITCH).click();
    await page.locator('.datepicker-months ' + DATE_PICKER_SWITCH).click();

    // Select the correct year
    await selectYear(page, year);

    // Select the correct month
    const monthIndex = parseInt(month) - 1;
    await page.locator(DATE_PICKER_MONTH).nth(monthIndex).click();

    // Select the correct day
    await page.locator(DATE_PICKER_DAY).getByText(day, { exact: true }).click();

    // Verify the selected date
    await expect(page.locator(DATE_PICKER_INPUT)).toHaveValue(date);
});
