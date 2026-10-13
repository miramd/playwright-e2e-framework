import { test, expect } from "@playwright/test";
import { Page } from "@playwright/test";


export class LoginPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async loginToYourAccount(email:string,pass:string){
    await this.page.getByPlaceholder('Email Address').first().fill(email)
    await this.page.getByPlaceholder('Password').fill(pass)
    await this.page.getByRole('button', {name:'Login'}).click()
  }

  async NewUserSignUp(name:string,email:string){

    await this.page.getByPlaceholder('Name').fill(name)
    await this.page.getByPlaceholder('Email Address').nth(1).fill(email)
    await this.page.getByRole('button', {name:'SignUp'}).click()
  }

  async FillNewUserInfo(page:Page, randomName:string){
    const { faker } = await import('@faker-js/faker');

    const randomPass = faker.internet.password();
    const randomNumber = faker.number.int({ min: 1 , max:31});
    const randomMonth = faker.number.int({ min: 1 , max:12});
    const randomYear = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });
    await page.getByRole('radio', { name: 'Mrs.' }).check();
    await page.getByRole('textbox', { name: 'Name *', exact: true }).fill(randomName);
    await page.getByRole('textbox', { name: 'Password *' }).fill(randomPass)
    await page.locator('#days').selectOption(String(randomNumber));
    await page.locator('#months').selectOption(String(randomMonth));
    await page.locator('#years').selectOption('2000');
    await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
    await page.getByRole('checkbox', { name: 'Receive special offers from' }).check();

    await page.getByRole('textbox', { name: 'First name' }).fill(randomName);
    await page.getByRole('textbox', { name: 'Last name' }).fill(randomName);
    await page.getByRole('textbox', { name: 'Address' }).first().fill(String(faker.location.city()));
    await page.getByLabel('Country').selectOption('Canada');
    await page.getByRole('textbox', { name: 'State *' }).fill(String(faker.location.city()));
    await page.getByRole('textbox', { name: 'City' }).fill(String(faker.location.city()));
    await page.locator('#zipcode').fill('0000');
    await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(String(faker.phone.number()));
    await page.getByRole('button', { name: 'Create Account' }).click();

    return randomPass;
  }
}
