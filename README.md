# Payment Center

A React, Express, Node.js, and MongoDB demo of a cardholder portal. Each browser receives its own fictional portfolio with two cards, 38 activity entries per card, and three reconciled statement periods per card. The portfolio lives in MongoDB and is associated with a 30-day HTTP-only cookie. It does not require account sign-in or real financial data.

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
