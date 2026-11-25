try { process.loadEnvFile(); } catch (error) { if (error.code !== "ENOENT") throw error; }
import express from "express";
import mongoose from "mongoose";
import { installAuth } from "./auth.js";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { demoPortfolio } from "./portfolio.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/payment_center";
await mongoose.connect(uri, { serverSelectionTimeoutMS: 7000 });
const portfolios = mongoose.connection.collection("paymentCenterDemoV3");
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const today = () => new Date().toISOString().slice(0, 10);

app.disable("x-powered-by");
app.use(express.json({ limit: "8kb" }));
const api = express.Router();
app.use("/api", api);
api.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  if (req.method !== "GET" && !req.is("application/json")) {
    return res.status(415).json({ error: "Send an application/json request." });
  }
  next();
});

const read = id => portfolios.findOne({ _id: id }, { projection: { _id: 0 } });
await installAuth(api, mongoose.connection, portfolios, demoPortfolio, asyncRoute);

api.get("/portfolio", asyncRoute(async (req, res) => {
  res.json(await read(req.accountId));
}));

const mutate = handler => asyncRoute(async (req, res) => {
  const id = req.accountId;
  if (!["everyday", "travel"].includes(req.params.card)) return res.status(404).json({ error: "Card not found." });
  const prefix = "cards." + req.params.card + ".";
  const result = await handler(req.body || {}, prefix, id);
  if (typeof result === "string") return res.status(400).json({ error: result });
  const portfolio = await read(id);
  if (!portfolio) return res.status(401).json({ error: "Reload to start a demo session." });
  const card = portfolio.cards[req.params.card];
  if (!result.write.matchedCount && !result.replayed?.(card)) {
    return res.status(409).json({ error: result.conflict });
  }
  res.json(portfolio);
});

api.post("/cards/:card/payments", mutate(async ({ amount, requestId }, p, id) => {
  if (!Number.isSafeInteger(amount) || amount < 1 || typeof requestId !== "string" || !uuid.test(requestId)) {
    return "Enter a valid payment amount.";
  }
  const tx = { id: requestId, merchant: "Online payment", date: today(), amount: -amount,
    category: "Payment", status: "Posted" };
  const write = await portfolios.updateOne(
    { _id: id, [p + "balance"]: { $gte: amount }, [p + "transactions.id"]: { $ne: requestId } },
    { $inc: { [p + "balance"]: -amount },
      $push: { [p + "transactions"]: { $each: [tx], $position: 0 } } },
  );
  return { write, conflict: "The payment exceeds the current balance or conflicts with an earlier submission.",
    replayed: card => card.transactions.some(item => item.id === requestId && item.amount === -amount) };
}));

api.post("/cards/:card/rewards", mutate(async ({ points, requestId }, p, id) => {
  if (!Number.isSafeInteger(points) || points < 1000 || points % 1000 ||
      typeof requestId !== "string" || !uuid.test(requestId)) return "Redeem in increments of 1,000 points.";
  const write = await portfolios.updateOne(
    { _id: id, [p + "points"]: { $gte: points }, [p + "redemptions.id"]: { $ne: requestId } },
    { $inc: { [p + "points"]: -points }, $push: { [p + "redemptions"]: { id: requestId, points, date: today() } } },
  );
  return { write, conflict: "You do not have enough points or this redemption conflicts with an existing one.",
    replayed: card => card.redemptions.some(item => item.id === requestId && item.points === points) };
}));

api.post("/cards/:card/disputes", mutate(async ({ transactionId, reason }, p, id) => {
  if (typeof transactionId !== "string" || !uuid.test(transactionId) ||
      !["Unrecognized charge", "Incorrect amount", "Duplicate charge"].includes(reason)) {
    return "Choose an eligible transaction and a dispute reason.";
  }
  const write = await portfolios.updateOne(
    { _id: id, [p + "disputes.transactionId"]: { $ne: transactionId },
      [p + "transactions"]: { $elemMatch: { id: transactionId, status: "Posted", amount: { $gt: 0 } } } },
    { $push: { [p + "disputes"]: { transactionId, reason, date: today(), status: "Submitted" } } },
  );
  return { write, conflict: "This transaction is ineligible or already has a dispute." };
}));

api.patch("/cards/:card/settings", mutate(async (body, p, id) => {
  const [key, ...other] = Object.keys(body);
  if (other.length || !["frozen", "autopay", "alerts"].includes(key) || typeof body[key] !== "boolean") {
    return "Choose a valid card preference.";
  }
  return { write: await portfolios.updateOne({ _id: id }, { $set: { [p + key]: body[key] } }) };
}));

api.use((_req, res) => res.status(404).json({ error: "API endpoint not found." }));
const build = fileURLToPath(new URL("./client/build/", import.meta.url));
if (existsSync(build)) {
  app.use(express.static(build));
  app.get(/^\/(?!.*\.).*$/, (_req, res) => res.sendFile("index.html", { root: build }));
}
app.use((err, _req, res, _next) => {
  if (err.status === 400 || err.status === 413) return res.status(err.status).json({ error: "Invalid request body." });
  console.error(err.name);
  res.status(500).json({ error: "Payment Center could not complete this request." });
});
app.listen(port, () => console.log("Payment Center listening on port", port));

