import { Page } from "@playwright/test";
import { NewUser } from "../utils/test-data";


export class LoginPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto(){
    await this.page.goto('/login')
  }

  async loginToYourAccount(email:string,pass:string){
    await this.page.getByTestId('login-email').fill(email)
    await this.page.getByTestId('login-password').fill(pass)
    await this.page.getByTestId('login-button').click()
  }

  async NewUserSignUp(name:string,email:string){
    await this.page.getByTestId('signup-name').fill(name)
    await this.page.getByTestId('signup-email').fill(email)
    await this.page.getByTestId('signup-button').click()
  }

  async FillNewUserInfo(user:NewUser){
    await this.page.getByRole('radio', { name: 'Mrs.' }).check();
    await this.page.getByRole('textbox', { name: 'Name *', exact: true }).fill(user.name);
    await this.page.getByRole('textbox', { name: 'Password *' }).fill(user.password)
    await this.page.locator('#days').selectOption('15');
    await this.page.locator('#months').selectOption('6');
    await this.page.locator('#years').selectOption('2000');
    await this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
    await this.page.getByRole('checkbox', { name: 'Receive special offers from' }).check();

    await this.page.getByRole('textbox', { name: 'First name' }).fill(user.firstName);
    await this.page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName);
    await this.page.getByRole('textbox', { name: 'Address' }).first().fill(user.address);
    await this.page.getByLabel('Country').selectOption('Canada');
    await this.page.getByRole('textbox', { name: 'State *' }).fill(user.state);
    await this.page.getByRole('textbox', { name: 'City' }).fill(user.city);
    await this.page.locator('#zipcode').fill(user.zipcode);
    await this.page.getByRole('textbox', { name: 'Mobile Number *' }).fill(user.mobile);
    await this.page.getByRole('button', { name: 'Create Account' }).click();
  }
}