# Payment Center

A React, Express, Node.js, and MongoDB demo of a cardholder portal. Jordan signs in with jordan@example.com and the demo password JordanDemo!2026. His persistent MongoDB account contains two cards, 38 activity entries per card, and three reconciled statement periods per card. Sessions expire after eight hours and logout revokes the session in MongoDB. Set JORDAN_DEMO_PASSWORD in the server environment to replace the default demo password. The login screen displays the default credentials for demonstration.

## Run locally

1. Use Node.js 22 and start MongoDB locally on port 27017, or set `MONGODB_URI` in a root `.env` file to point to a MongoDB database. The default database is `payment_center`.
2. Run `npm run build` to install dependencies and build the React client.
3. Run `npm run start:prod` and open http://localhost:3001. For client development use `npm run start:dev`.

## Demo workflows

- Switch between two cards and see independent balances, activity, statements, and rewards.
- Make a simulated payment from the demo funding account. The balance and transaction history update together. Retrying a payment with the same request ID does not post another payment.
- Filter and search activity, view transaction details, and submit disputes for posted purchases.
- Review statement snapshots and download a statement's activity as CSV.
- Redeem rewards and view redemption history.
- Save card freeze, AutoPay, and alert preferences. The demo does not schedule payments, deliver alerts, or communicate with a card issuer.

Production hosting needs Node.js 22, the `MONGODB_URI` environment variable, a build command of `npm run build`, and a start command of `npm run start:prod`. The build never seeds or resets an existing database. Demo portfolios use the separate `paymentCenterDemoV3` collection.


## Authentication

Open /login and sign in to reach /dashboard. Anonymous API requests return 401. POST /api/auth/login accepts email and password, GET /api/auth/me returns the signed-in user, and POST /api/auth/logout revokes the session. Passwords are hashed with salted scrypt. MongoDB stores hashes of opaque session tokens. Existing browser demo portfolios remain in their original collection. Jordan uses a separate stable account record.

Run the focused authentication regression check with node --test auth.test.js. Existing Playwright tests must sign in before accessing the portfolio or making account changes. Tests that change Jordan’s account share his data and should run sequentially or use separate test accounts.
