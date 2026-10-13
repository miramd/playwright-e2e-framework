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