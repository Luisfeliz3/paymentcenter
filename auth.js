import { randomBytes, createHash, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt);
const digest = token => createHash("sha256").update(token).digest("hex");
const cookieName = "pc_session";
const lifetime = 8 * 60 * 60 * 1000;

export async function installAuth(api, db, portfolios, demoPortfolio, asyncRoute) {
  const users = db.collection("paymentCenterUsers");
  const sessions = db.collection("paymentCenterSessions");
  await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  const email = "jordan@example.com";
  const password = process.env.JORDAN_DEMO_PASSWORD || "JordanDemo!2026";
  const salt = randomBytes(16).toString("hex");
  const hash = Buffer.from(await derive(password, salt, 64)).toString("hex");
  await users.updateOne({ _id: email }, {
    $setOnInsert: { name: "Jordan Taylor", portfolioId: "account:jordan" },
    $set: { salt, hash },
  }, { upsert: true });
  await portfolios.updateOne({ _id: "account:jordan" }, {
    $setOnInsert: demoPortfolio("account:jordan"),
  }, { upsert: true });

  const tokenFrom = req => /(?:^|;\s*)pc_session=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie || "")?.[1];
  const cookieOptions = req => ({
    httpOnly: true, sameSite: "strict", secure: req.secure || process.env.RENDER === "true", path: "/",
  });
  // Browser mutations must originate from the same site.
  api.use((req, res, next) => {
    if (req.method !== "GET" && req.headers["sec-fetch-site"] === "cross-site") {
      return res.status(403).json({ error: "Use Payment Center to submit this request." });
    }
    next();
  });

  const attempts = new Map();
  api.post("/auth/login", asyncRoute(async (req, res) => {
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
    const address = req.ip;
    const count = attempts.get(address) || { count: 0, until: now + 60000 };
    if (count.count >= 10) return res.status(429).json({ error: "Too many attempts. Try again in one minute." });
    count.count++;
    attempts.set(address, count);
    const suppliedEmail = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const suppliedPassword = req.body?.password;
    if (typeof suppliedPassword !== "string" || suppliedPassword.length > 256) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }
    const user = await users.findOne({ _id: email });
    const candidate = await derive(suppliedPassword, user.salt, 64);
    if (!timingSafeEqual(Buffer.from(user.hash, "hex"), candidate) || suppliedEmail !== email) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }
    const previous = tokenFrom(req);
    if (previous) await sessions.deleteOne({ _id: digest(previous) });
    const token = randomBytes(32).toString("hex");
    await sessions.insertOne({ _id: digest(token), userId: email, portfolioId: user.portfolioId,
      expiresAt: new Date(now + lifetime) });
    res.cookie(cookieName, token, { ...cookieOptions(req), maxAge: lifetime });
    res.json({ name: user.name, email });
  }));

  api.post("/auth/logout", asyncRoute(async (req, res) => {
    const token = tokenFrom(req);
    if (token) await sessions.deleteOne({ _id: digest(token) });
    res.clearCookie(cookieName, cookieOptions(req));
    res.json({ success: true });
  }));

  api.use(asyncRoute(async (req, res, next) => {
    const token = tokenFrom(req);
    const session = token && await sessions.findOne({ _id: digest(token), expiresAt: { $gt: new Date() } });
    if (!session) return res.status(401).json({ error: "Please sign in to your account." });
    req.accountId = session.portfolioId;
    next();
  }));
  api.get("/auth/me", (_req, res) => res.json({ name: "Jordan Taylor", email }));
}
