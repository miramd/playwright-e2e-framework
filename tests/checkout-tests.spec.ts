import { Page } from '@playwright/test'
import { test, expect } from '../fixtures/api-user'
import { LoginPage } from '../pages/login-page'
import { ProductsPage } from '../pages/products-page'
import { CheckoutPage } from '../pages/checkout-page'
import { generateUser } from '../utils/test-data'

const PRODUCT_ID = 19

// --- helpers shared by the order tests ---

async function login(page: Page, user: { name: string; email: string; password: string }) {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.loginToYourAccount(user.email, user.password)
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible()
}

// adds a product, opens the cart and clicks "Proceed To Checkout"
async function startCheckout(page: Page, productId = PRODUCT_ID) {
    const productsPage = new ProductsPage(page)
    const checkoutPage = new CheckoutPage(page)

    await productsPage.addToCart(productId,1)
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible()
    await page.getByRole('link', { name: 'View Cart' }).click()
    await checkoutPage.proceedToCheckout()
}

// --- tests ---

test('Place an order after logging in', async ({ page, apiUser }) => {
    const checkoutPage = new CheckoutPage(page)

    await login(page, apiUser)
    await startCheckout(page)
    await checkoutPage.placeOrder('Please deliver in the morning')
    await checkoutPage.payWithCard(apiUser.name)

    await expect(page.getByText('Order Placed!')).toBeVisible()
})

test('Register before checkout, then place an order', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const checkoutPage = new CheckoutPage(page)
    const user = generateUser()

    // register through the UI
    await loginPage.goto()
    await loginPage.NewUserSignUp(user.name, user.email)
    await loginPage.FillNewUserInfo(user)
    await expect(page.getByText('Account Created!')).toBeVisible()
    await page.getByRole('link', { name: 'Continue' }).click()
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible()

    // order
    await startCheckout(page)
    await checkoutPage.placeOrder('Registered before checkout')
    await checkoutPage.payWithCard(user.name)
    await expect(page.getByText('Order Placed!')).toBeVisible()

    // cleanup: delete the account this test created
    await page.getByRole('link', { name: 'Continue' }).click()
    await page.getByRole('link', { name: 'Delete Account' }).click()
    await expect(page.getByText('Account Deleted!')).toBeVisible()
})

test('Delivery and billing address match the registration details', async ({ page, apiUser }) => {
    await login(page, apiUser)
    await startCheckout(page)

    const blocks = [
    { heading: 'Your delivery address' },
    { heading: 'Your billing address' },
]

for (const { heading } of blocks) {
    const block = page.locator('ul.address').filter({ hasText: heading })

    await expect(block.locator('li')).toHaveText([
        heading,
        `Mrs. ${apiUser.firstName} ${apiUser.lastName}`,
        'QA',
        apiUser.address,
        '',
        `${apiUser.city} ${apiUser.state} ${apiUser.zipcode}`,
        'Canada',
        apiUser.mobile,
    ])
}
    
})

test('Download the invoice after purchase', async ({ page, apiUser,browserName }) => {
    const checkoutPage = new CheckoutPage(page)

    await login(page, apiUser)
    await startCheckout(page)
    await checkoutPage.placeOrder('Invoice download test')
    await checkoutPage.payWithCard(apiUser.name)
    await expect(page.getByText('Order Placed!')).toBeVisible()

    // start waiting for the download BEFORE clicking

     const invoiceLink = page.getByRole('link', { name: 'Download Invoice' })

    if (browserName === 'webkit') {
        // WebKit doesn't emit a download event for this link, so fetch the invoice directly
        const href = await invoiceLink.getAttribute('href')
        const res = await page.request.get(href!)
        expect(res.ok()).toBeTruthy()
        expect((await res.text()).length).toBeGreaterThan(0)
    } else {
        const downloadPromise = page.waitForEvent('download')
        await invoiceLink.click()
        const download = await downloadPromise
        expect(download.suggestedFilename()).toContain('invoice')
    }
})