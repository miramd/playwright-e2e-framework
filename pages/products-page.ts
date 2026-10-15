import { Page , expect} from "@playwright/test";


export class ProductsPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto(){
    await this.page.goto('/products')
  }

  async searchProduct(productName:string){

        await this.page.getByRole('textbox', { name: 'Search Product' }).fill(productName)
        await this.page.locator('#submit_search').click()        
  }

  async addReview(productID:number,name:string,email:string,review:string){
    await this.page.goto(`/product_details/${productID}`)
    await this.page.getByRole('textbox', { name: 'Your Name' }).fill(name)
    await this.page.getByRole('textbox', { name: 'Email Address' }).first().fill(email)
    await this.page.getByRole('textbox', { name: 'Add Review Here!' }).fill(review)
    await this.page.getByRole('button', { name: 'Submit' }).click()
  }

  async addToCart(productID:number,quantity:number){
  await this.page.goto(`/product_details/${productID}`, { waitUntil: 'domcontentloaded' })
   await this.page.locator('.product-information h2').waitFor({ timeout: 30_000 })
   const name = (await this.page.locator('.product-information h2').innerText()).trim()
    await this.page.locator('#quantity').fill(String(quantity))   // verify locator in codegen

   await this.page.getByRole('button', { name: 'Add to cart' }).click();
   return name;
}
}