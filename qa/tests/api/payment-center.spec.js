import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

async function portfolio(request) {
  const response = await request.get('/api/portfolio');
  expect(response.status(), await response.text()).toBe(200);
  return response.json();
}

const post = (request, resource, data, card = 'everyday') =>
  request.post('/api/cards/' + card + '/' + resource, { data });

test('creates a private demo session with two reconciled card statements', async ({ request, playwright, baseURL }) => {
  const response = await request.get('/api/portfolio');
  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toBe('no-store');
  expect(response.headers()['set-cookie']).toMatch(/HttpOnly/i);
  const first = await response.json();
  expect(Object.keys(first.cards).sort()).toEqual(['everyday', 'travel']);
  expect(first).not.toHaveProperty('_id');
  for (const card of Object.values(first.cards)) {
    expect(card.statements).toHaveLength(3);
    expect(card.transactions.map(tx => tx.status)).toEqual(expect.arrayContaining(['Posted', 'Pending']));
    for (const statement of card.statements) {
      expect(statement.previous + statement.rows.reduce((sum, row) => sum + row.amount, 0)).toBe(statement.balance);
    }
  }
  expect(await portfolio(request)).toEqual(first);
  const other = await playwright.request.newContext({ baseURL });
  try {
    const fresh = await portfolio(other);
    expect(fresh.cards.everyday.transactions[0].id).not.toBe(first.cards.everyday.transactions[0].id);
  } finally {
    await other.dispose();
  }
});

test('posts a payment once when retried concurrently and preserves the other card', async ({ request }) => {
  const before = await portfolio(request);
  const data = { amount: 2500, requestId: randomUUID() };
  const results = await Promise.all([post(request, 'payments', data), post(request, 'payments', data)]);
  expect(results.map(response => response.status())).toEqual([200, 200]);
  const after = await portfolio(request);
  expect(after.cards.everyday.balance).toBe(before.cards.everyday.balance - data.amount);
  expect(after.cards.everyday.transactions.filter(tx => tx.id === data.requestId)).toEqual([
    expect.objectContaining({ amount: -2500, category: 'Payment', status: 'Posted' }),
  ]);
  expect(after.cards.travel).toEqual(before.cards.travel);
  expect((await post(request, 'payments', { ...data, amount: 2600 })).status()).toBe(409);
});

test('rejects invalid payments and wrong routes without changing the portfolio', async ({ request }) => {
  const attempt = { amount: 100, requestId: randomUUID() };
  expect((await post(request, 'payments', attempt)).status()).toBe(401);
  const before = await portfolio(request);
  expect((await post(request, 'payments', { ...attempt, amount: 0 })).status()).toBe(400);
  expect((await post(request, 'payments', { ...attempt, requestId: 'invalid' })).status()).toBe(400);
  expect((await post(request, 'payments', { ...attempt, amount: before.cards.everyday.balance + 1 })).status()).toBe(409);
  expect((await post(request, 'payments', attempt, 'missing')).status()).toBe(404);
  expect((await request.get('/api/not-a-route')).status()).toBe(404);
  expect((await request.post('/api/cards/everyday/payments', { data: 'plain text' })).status()).toBe(415);
  expect(await portfolio(request)).toEqual(before);
});

test('redeems points once and rejects invalid increments and excessive amounts', async ({ request }) => {
  const before = await portfolio(request);
  const data = { points: 1000, requestId: randomUUID() };
  expect((await post(request, 'rewards', data)).status()).toBe(200);
  expect((await post(request, 'rewards', data)).status()).toBe(200);
  expect((await post(request, 'rewards', { points: 1500, requestId: randomUUID() })).status()).toBe(400);
  expect((await post(request, 'rewards', { points: 1000000, requestId: randomUUID() })).status()).toBe(409);
  const after = await portfolio(request);
  expect(after.cards.everyday.points).toBe(before.cards.everyday.points - 1000);
  expect(after.cards.everyday.redemptions).toEqual([expect.objectContaining({ id: data.requestId, points: 1000 })]);
});

test('accepts a posted purchase dispute and rejects pending and duplicate claims', async ({ request }) => {
  const { cards } = await portfolio(request);
  const purchase = cards.everyday.transactions.find(tx => tx.status === 'Posted' && tx.amount > 0);
  const pending = cards.everyday.transactions.find(tx => tx.status === 'Pending');
  const data = { transactionId: purchase.id, reason: 'Duplicate charge' };
  expect((await post(request, 'disputes', { ...data, transactionId: pending.id })).status()).toBe(409);
  expect((await post(request, 'disputes', { ...data, reason: 'Other' })).status()).toBe(400);
  expect((await post(request, 'disputes', data)).status()).toBe(200);
  expect((await post(request, 'disputes', data)).status()).toBe(409);
  const after = await portfolio(request);
  expect(after.cards.everyday.disputes).toEqual([expect.objectContaining({ ...data, status: 'Submitted' })]);
});

test('stores each preference on the requested card and rejects mixed updates', async ({ request }) => {
  const before = await portfolio(request);
  const url = '/api/cards/travel/settings';
  for (const [setting, value] of Object.entries({ frozen: true, autopay: true, alerts: false })) {
    const response = await request.patch(url, { data: { [setting]: value } });
    expect(response.status()).toBe(200);
    expect((await response.json()).cards.travel[setting]).toBe(value);
  }
  expect((await request.patch(url, { data: { frozen: false, alerts: true } })).status()).toBe(400);
  const after = await portfolio(request);
  expect(after.cards.everyday).toEqual(before.cards.everyday);
  expect(after.cards.travel).toMatchObject({ frozen: true, autopay: true, alerts: false });
});
