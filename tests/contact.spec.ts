import {test, expect} from '@playwright/test'

test('Contact form with file upload and alert dialog', async({page})=>{

    await page.goto('/contact_us')
    // await page.getByRole('link', {name:'Contact Us'}).click();
    await page.getByPlaceholder('Name').fill('random')
    await page.getByPlaceholder('Email').first().fill('random@test.com')
    await page.getByPlaceholder('Subject').fill('random')
    await page.getByPlaceholder('Your Message Here').fill('random')

await page.locator('input[type="file"]').setInputFiles('test-files/test.txt')

page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('OK')
    await dialog.accept()
})
await page.getByTestId('submit-button').click()
await expect(page.getByText('Success! Your details have been submitted successfully.').first()).toBeVisible()
})