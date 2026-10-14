import { test, expect } from '../fixtures/api-user'
import { LoginPage } from '../pages/login-page'
import { generateUser } from '../utils/test-data'

test.beforeEach(async ({ page }) => {
    await new LoginPage(page).goto()
})

test('login with valid credentials', async ({ page, apiUser }) => {
    const loginPage = new LoginPage(page)
    await loginPage.loginToYourAccount(apiUser.email, apiUser.password)
    await expect(page.getByText(`Logged in as ${apiUser.name}`)).toBeVisible();
});

test('login with wrong credentials shows an error', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const user = generateUser()
    await loginPage.loginToYourAccount(user.email, user.password)
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
})

test('logout returns to the login page', async ({ page, apiUser }) => {
    const loginPage = new LoginPage(page)
    await loginPage.loginToYourAccount(apiUser.email, apiUser.password)
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('register with an existing email shows an error', async ({ page, apiUser }) => {
    const loginPage = new LoginPage(page)
    await loginPage.NewUserSignUp(apiUser.name, apiUser.email)
    await expect(page.getByText('Email Address already exist!')).toBeVisible();
});

test('register a new user', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const user = generateUser()
    await loginPage.NewUserSignUp(user.name, user.email)
    await loginPage.FillNewUserInfo(user)
    await expect(page.getByText('Account Created!')).toBeVisible();

    // cleanup: delete the account this test created
    await page.getByRole('link', { name: 'Continue' }).click()
    await page.getByRole('link', { name: 'Delete Account' }).click()
    await expect(page.getByText('Account Deleted!')).toBeVisible();
});

test('delete account, then try to login with the same credentials', async ({ page, apiUser }) => {
    const loginPage = new LoginPage(page)
    await loginPage.loginToYourAccount(apiUser.email, apiUser.password)
    await page.getByRole('link', { name: 'Delete Account' }).click()
    await expect(page.getByText('Account Deleted!')).toBeVisible();

    await loginPage.goto()
    await loginPage.loginToYourAccount(apiUser.email, apiUser.password)
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
});

test('Register with an invalid email format', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await page.getByPlaceholder('Name').fill('Random')
    await page.getByPlaceholder('Email Address').nth(1).fill('hi')
    await page.getByTestId('signup-button').click()

});

test('Register with an invalid email format is blocked', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    const emailInput = page.getByTestId('signup-email')
    await page.getByTestId('signup-name').fill('Mira Test')
    await emailInput.fill('not-an-email')
    await page.getByTestId('signup-button').click()

    // the browser blocked the submit: still on the login page, no signup form shown
    await expect(page).toHaveURL(/login/)
    await expect(page.getByText('Enter Account Information')).not.toBeVisible()

    // the field itself reports why
    const typeMismatch = await emailInput.evaluate((el: HTMLInputElement) => el.validity.typeMismatch)
    expect(typeMismatch).toBe(true)
})

test('Register with a missing name is blocked', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    const nameInput = page.getByTestId('signup-name')
    await page.getByTestId('signup-email').fill('someone@example.com')
    await page.getByTestId('signup-button').click()

    await expect(page).toHaveURL(/login/)
    const valueMissing = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing)
    expect(valueMissing).toBe(true)
})