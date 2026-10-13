import {test, expect} from '@playwright/test'
import { LoginPage } from '../pages/login-page'

test('login with valid credentials', async({page})=>{
    await page.goto('/login')
    const loginPage = new LoginPage(page)
    await loginPage.loginToYourAccount('miramadani33@gmail.com','mira')
});

test('Login with wrong credentials shows an error', async({page})=>{
    await page.goto('/login')
    const loginPage = new LoginPage(page)
    const { faker } = await import('@faker-js/faker');
    const randomEmail = faker.internet.email({provider:'gmail.com'});
    const randomPass = faker.internet.password();
    await loginPage.loginToYourAccount(randomEmail,randomPass)
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
})


test('Logout returns to the login page ', async({page})=>{
    await page.goto('/login')
    const loginPage = new LoginPage(page)
    await loginPage.loginToYourAccount('miramadani33@gmail.com','mira')
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('Register with an existing email shows an error', async({page})=>{
    await page.goto('/login')
    const loginPage = new LoginPage(page)
    await loginPage.NewUserSignUp('mira', 'miramadani33@gmail.com')
    await expect(page.getByText('Email Address already exist!')).toBeVisible();
});

test('Register a new user', async({page})=>{
    await page.goto('/login')
    const loginPage = new LoginPage(page)
    const { faker } = await import('@faker-js/faker');
    const randomName = faker.person.fullName();
    const randomEmail = faker.internet.email({provider:'gmail.com'});
    await loginPage.NewUserSignUp(randomName,randomEmail)
    await loginPage.FillNewUserInfo(page,randomName)
    await expect(page.getByText('Account Created!')).toBeVisible();
});

test('Delete Account, try to login with same credentials', async({page})=>{
     await page.goto('/login')
    const loginPage = new LoginPage(page)
    const { faker } = await import('@faker-js/faker');
    const randomName = faker.person.fullName();
    const randomEmail = faker.internet.email({provider:'gmail.com'});
    await loginPage.NewUserSignUp(randomName,randomEmail)
    const randomPass = await loginPage.FillNewUserInfo(page,randomName)
    await expect(page.getByText('Account Created!')).toBeVisible();

    await page.getByRole('link', { name: 'Continue' }).click()
    await page.getByRole('link', { name: 'Delete Account' }).click()

    await expect(page.getByText('Account Deleted!')).toBeVisible();

    await page.goto('/login')

    await loginPage.loginToYourAccount(randomEmail,randomPass)
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();

});