import { expect, test } from '@playwright/test';

async function getDate(y, m, d) {
    if (parseInt(m) < 10) {
        m = '0' + m;
    }
    if (parseInt(d) < 10) {
        d = '0' + d;
    }
    return `${m}-${d}-${y}`;
}

test('Date Picker', async ({ page }) => {
    await page.goto('https://www.webdriveruniversity.com/Datepicker/index.html');
    const y = '1989';
    const m = '2';
    const d = '9';
    const date = await getDate(y, m, d);
    await page.locator('#datepicker input').first().click();
    await page.locator('.datepicker-days .datepicker-switch').click();
    await page.locator('.datepicker-months .datepicker-switch').click();
    let range = await page.locator('.datepicker-years .datepicker-switch').textContent();
    if (range) {
        let lower = parseInt(range.split('-')[0]);
        let upper = parseInt(range.split('-')[1]);
        while (!((parseInt(y) >= lower) && (parseInt(y) <= upper))) {
            if (parseInt(y) < lower) {
                await page.locator('.datepicker-years .prev').click();
            } else if (parseInt(y) > upper) {
                await page.locator('.datepicker-years .next').click();
            }
            range = await page.locator('.datepicker-years .datepicker-switch').textContent();
            if (range) {
                lower = parseInt(range.split('-')[0]);
                upper = parseInt(range.split('-')[1]);
            }
        }
    }
    await page.locator(`.datepicker-years .year:has-text("${y}")`).click();
    const i = parseInt(m) - 1;
    await page.locator('.datepicker-months .month').nth(i).click();
    await page.locator('[class="day"]').getByText(d, {exact: true}).click();
    await expect(page.locator('#datepicker input')).toHaveValue(date);
});
