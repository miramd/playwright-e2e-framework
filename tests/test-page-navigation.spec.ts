import {test, expect} from '@playwright/test'

test('goto main page', async ({page})=>{
    await page.goto('/login')
})