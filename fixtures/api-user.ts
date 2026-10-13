import { test as base, expect } from '@playwright/test'
import { generateUser } from '../utils/test-data'

type TestUser = { name: string; email: string; password: string }

export const test = base.extend<{ apiUser: TestUser }>({
 
  // runs for every test that uses `page`
  page: async ({ page }, use) => {
    await page.route(/googlesyndication|doubleclick|googleadservices|adservice\.google/, route => route.abort())
    await use(page)
  },
  apiUser: async ({ request }, use) => {
    const u = generateUser()

    // Setup: create the account through the API (fast, no UI needed)
    const res = await request.post('/api/createAccount', {
      form: {
        name: u.name,
        email: u.email,
        password: u.password,
        title: 'Mrs',
        birth_date: '15',
        birth_month: '6',
        birth_year: '2000',
        firstname: u.firstName,
        lastname: u.lastName,
        company: 'QA',
        address1: u.address,
        address2: '',
        country: 'Canada',
        zipcode: u.zipcode,
        state: u.state,
        city: u.city,
        mobile_number: u.mobile,
      },
    })
    expect((await res.json()).responseCode).toBe(201)

    await use({ name: u.name, email: u.email, password: u.password })

    // Teardown: delete the account (harmless if the test already deleted it)
    await request.delete('/api/deleteAccount', {
      form: { email: u.email, password: u.password },
    })
  },
})

export { expect }