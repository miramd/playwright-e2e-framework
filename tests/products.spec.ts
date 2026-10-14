// import {test , expect} from '@playwright/test'
import { ProductsPage } from '../pages/products-page'
import { faker } from '@faker-js/faker'
import { LoginPage } from '../pages/login-page'
import { test, expect } from '../fixtures/api-user'



test.beforeEach(async ({page}) => {
const productsPage = new ProductsPage(page)
await page.goto('/products')
})

test('View all products and open a product detail page ', async ({ page, request }) => {

    const res = await request.get('/api/productsList')
    const { products } = await res.json()

    await expect(page.locator('.features_items .col-sm-4')).toHaveCount(products.length)

    const nameProduct = await page.locator('.productinfo p').first().textContent()
    const priceProduct = await page.locator('.productinfo h2').first().textContent()
    await page.getByRole('link', { name: 'View Product' }).first().click()

    await expect(page.locator('.product-information h2')).toHaveText(nameProduct!)
    await expect(page.locator('.product-information span').nth(1)).toHaveText(priceProduct!)
})

test('Search for a product and verify results', async ({ page }) => {
    const term = 'dress'
    test.setTimeout(1000000)
    const productsPage = new ProductsPage(page)
    const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase()

    await productsPage.searchProduct(term)
    await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible()

    const cards = page.locator('.features_items .col-sm-4')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    // Search matches name OR category, so collect results whose name lacks the term
    const nameMisses: string[] = []
    for (let i = 0; i < count; i++) {
        const card = cards.nth(i)
        const name = norm(await card.locator('.productinfo p').innerText())
        if (!name.includes(term)) {
            nameMisses.push((await card.getByRole('link', { name: 'View Product' }).getAttribute('href'))!)
        }
    }

    // ...and confirm the term appears in their category on the detail page
    for (const href of nameMisses) {
        await page.goto(href)
        await expect(page.locator('.product-information')).toContainText(new RegExp(term, 'i'))
    }
})



test('Add a review on a product', async ({ page }) => {
   const productsPage =new ProductsPage(page)
   let productID = 19;
   await productsPage.addReview(productID,'Mira','email@test.com','great quality')
   await expect(page.getByText('Thank you for your review.')).toBeVisible()

});

test('Add products to cart', async({page})=>{
    let productID1=19;
    let productID2=20;

    const productsPage= new ProductsPage(page)
    const name1= await productsPage.addToCart(productID1,1)
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible()
    const name2= await productsPage.addToCart(productID2,1)
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible()


    await page.getByRole('link', { name: 'View Cart' }).click()
    const cart = page.locator('#cart_info_table')
    await expect(cart.locator('tbody tr')).toHaveCount(2)
    await expect(cart).toContainText(name1)
    await expect(cart).toContainText(name2)

})

test('Verify product quantity in the cart', async ({ page }) => {
    const productsPage = new ProductsPage(page)

    await productsPage.addToCart(19, 4)
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible()
    await page.getByRole('link', { name: 'View Cart' }).click()

    const row = page.locator('#cart_info_table tbody tr').first()
    await expect(row.locator('.cart_quantity')).toHaveText('4')

    const toNumber = (s: string) => Number(s.replace(/\D/g, ''))
    const unit = toNumber(await row.locator('.cart_price').innerText())
    const total = toNumber(await row.locator('.cart_total').innerText())
    expect(total).toBe(unit * 4)

   
})

test('remove a product from the cart', async ({ page }) => {
    const productsPage = new ProductsPage(page)

    const first = await productsPage.addToCart(19,1)
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible()
    const second = await productsPage.addToCart(20,1)
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible()
    await page.getByRole('link', { name: 'View Cart' }).click()

    const rows = page.locator('#cart_info_table tbody tr')
    await expect(rows).toHaveCount(2)

    const row = rows.filter({ hasText: first })

await expect(async () => {
    if (await row.count() > 0) {
        await row.locator('.cart_quantity_delete').click()
    }
    await expect(rows).toHaveCount(1, { timeout: 5000 })
}).toPass({ timeout: 30_000 })

await expect(page.locator('#cart_info_table')).not.toContainText(first)
await expect(page.locator('#cart_info_table')).toContainText(second)
})

test('Cart items persist after login', async ({ page, apiUser }) => {
    const productsPage = new ProductsPage(page)
    const loginPage = new LoginPage(page)

    const first = await productsPage.addToCart(19,1)
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible()
    const second = await productsPage.addToCart(20,1)
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible()

    await page.getByRole('link', { name: 'View Cart' }).click()
    await expect(page.locator('#cart_info_table tbody tr')).toHaveCount(2)

    // log in as the API-created user
    await loginPage.goto()
    await loginPage.loginToYourAccount(apiUser.email, apiUser.password)
    await expect(page.getByText(`Logged in as ${apiUser.name}`)).toBeVisible()

    // the same items should still be in the cart
    await page.getByRole('link', { name: 'Cart' }).first().click()
    const cart = page.locator('#cart_info_table')
    await expect(cart.locator('tbody tr')).toHaveCount(2)
    await expect(cart).toContainText(first)
    await expect(cart).toContainText(second)
})