import {test, expect} from '@playwright/test'


test('Verify Login endpoint rejects invalid credentials', async ({ request }) => {
    const res = await request.post('/api/verifyLogin', {
        form: {
            email: 'hi@test.com',
            password: 'hi',
        },
    })

    const body = await res.json()
    expect(body.responseCode).toBe(404)
    expect(body.message).toBe('User not found!')
})


test('Products list endpoint returns the expected data', async ({ request }) => {
    const res = await request.get('/api/productsList')

    expect(res.status()).toBe(200)

    const body = await res.json()

    expect(body.responseCode).toBe(200)
    expect(body.products).toBeInstanceOf(Array)
    expect(body.products.length).toBeGreaterThan(0)
})