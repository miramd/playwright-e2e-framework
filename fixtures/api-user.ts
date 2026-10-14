import { test as base, expect } from '@playwright/test'
import { generateUser, NewUser } from '../utils/test-data'

export const test = base.extend<{ apiUser: NewUser }>({
  // block ad requests so the Google ad interstitial can't intercept clicks
  page: async ({ page }, use) => {
    await page.route(
      /googlesyndication|doubleclick|googleadservices|adservice\.google/,
      route => route.abort()
    )
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

    await use(u)

    // Teardown: delete the account (harmless if the test already deleted it)
    await request.delete('/api/deleteAccount', {
      form: { email: u.email, password: u.password },
    })
  },
})

export { expect }