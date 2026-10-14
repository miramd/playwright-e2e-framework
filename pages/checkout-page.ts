import { Page ,expect} from '@playwright/test'

export class CheckoutPage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

   async proceedToCheckout() {
    await this.page.getByText('Proceed To Checkout').click()

    await this.page.goto('/checkout')
  }

  async placeOrder(comment: string) {
    await this.page.locator('textarea[name="message"]').fill(comment);
    await this.page.getByRole('link', { name: 'Place Order' }).click();
  }

  // dummy card values only: the site accepts any data
  async payWithCard(name: string) {
    await this.page.getByTestId('name-on-card').fill(name)
    await this.page.getByTestId('card-number').fill('4111111111111111')
    await this.page.getByTestId('cvc').fill('123')
    await this.page.getByTestId('expiry-month').fill('12')
    await this.page.getByTestId('expiry-year').fill('2030')
    await this.page.getByTestId('pay-button').click()
  }
}