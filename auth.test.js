import { test } from "node:test";
import assert from "node:assert/strict";
import { installAuth } from "./auth.js";

test("Jordan login protects account access, restores identity and invalidates logout", async () => {
  const routes = new Map(), middleware = [];
  const api = { use: fn => middleware.push(fn), post: (path, fn) => routes.set(path, fn),
    get: (path, fn) => routes.set(path, fn) };
  const records = new Map();
  const db = { collection(name) {
    if (!records.has(name)) records.set(name, new Map());
    const data = records.get(name);
    return {
      createIndex: async () => {},
      updateOne: async (query, update) => {
        const old = data.get(query._id);
        data.set(query._id, { ...(old || { _id: query._id, ...update.$setOnInsert }), ...update.$set });
      },
      insertOne: async doc => data.set(doc._id, doc),
      deleteOne: async query => data.delete(query._id),
      findOne: async query => {
        const doc = data.get(query._id);
        return doc && (!query.expiresAt || doc.expiresAt > query.expiresAt.$gt) ? doc : null;
      },
    };
  }};
  const wrap = fn => fn;
  await installAuth(api, db, db.collection("portfolios"), id => ({ _id: id, name: "Jordan Taylor" }), wrap);
  function response() {
    return { statusCode: 200, status(code) { this.statusCode = code; return this; },
      json(data) { this.data = data; return this; }, cookie(name, token) { this.token = token; },
      clearCookie() { this.cleared = true; } };
  }
  const guard = middleware[1];
  const denied = response();
  await guard({ headers: {} }, denied, () => assert.fail("Anonymous access"));
  assert.equal(denied.statusCode, 401);
  const wrong = response();
  await routes.get("/auth/login")({ headers: {}, ip: "test", body: { email: "jordan@example.com", password: "wrong" } }, wrong);
  assert.equal(wrong.statusCode, 401);
  const login = response();
  await routes.get("/auth/login")({ headers: {}, ip: "test", body: { email: "jordan@example.com", password: process.env.JORDAN_DEMO_PASSWORD || "JordanDemo!2026" } }, login);
  assert.equal(login.data.name, "Jordan Taylor");
  assert.match(login.token, /^[a-f0-9]{64}$/);
  const req = { headers: { cookie: "pc_session=" + login.token } };
  let allowed = false;
  await guard(req, response(), () => { allowed = true; });
  assert(allowed);
  assert.equal(req.accountId, "account:jordan");
  assert(!records.get("paymentCenterSessions").has(login.token));
  await routes.get("/auth/logout")(req, response());
  const revoked = response();
  await guard(req, revoked, () => assert.fail("Revoked session"));
  assert.equal(revoked.statusCode, 401);
});
