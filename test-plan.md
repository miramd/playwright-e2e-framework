# Test Plan: Automation Exercise

**App under test:** https://automationexercise.com
**Scope:** User account flows, product browsing, cart, checkout, contact form
**Tools:** Playwright + TypeScript, GitHub Actions
## Out of scope
Payment gateway internals, performance, accessibility.

TC01 - Register a new user (UI) 
TC02 - Register with an existing email shows an error (UI) 
TC03 - Login with valid credentials (UI)
TC04 - Login with wrong credentials shows an error (UI)
TC05 - Logout returns to the login page (UI)
TC06 - Delete account, then try to log in with the same credentials (UI)
TC07 - View all products and open a product detail page (UI)
TC08 - Search for a product and verify results (UI)
TC09 - Add a review on a product (UI)
TC10 - Add products to the cart (UI)
TC11 - Verify product quantity in the cart (UI)
TC12 - Remove a product from the cart (UI)
TC13 - Search, add to cart, log in, and verify the cart persists (UI)
TC14 - Place an order after logging in (UI)
TC15 - Register before checkout, then place an order (UI)
TC16 - Verify address details on the checkout page (UI)
TC17 - Download the invoice after purchase (UI)
TC18 - Contact form with file upload and alert dialog (UI)
TC19 - Create a user via API, log in via UI, verify the account (UI + API)
TC20 - Products list endpoint returns the expected data (API)
TC21 - Verify-login endpoint rejects invalid credentials (API)
TC22 - Register with an invalid email format or a missing required field (UI)