import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const money = cents => usd.format(cents / 100);
const overview = page => page.getByRole('heading', { name: 'Welcome back, Jordan' });

test.beforeEach(async ({ page }) => {
  await page.goto('/dashboard');
  await expect(overview(page)).toBeVisible();
});

test('switches cards and shows the corresponding balance and available credit', async ({ page }) => {
  const { cards } = await (await page.request.get('/api/portfolio')).json();
  const currentBalance = page.locator('.hero .amount');
  const availableCredit = page.getByText('Available credit', { exact: true }).locator('+ dd');
  const expectedCredit = card => card.limit - card.balance - card.transactions
    .filter(transaction => transaction.status === 'Pending')
    .reduce((total, transaction) => total + transaction.amount, 0);

  await expect(currentBalance).toHaveText(money(cards.everyday.balance));
  await expect(availableCredit).toHaveText(money(expectedCredit(cards.everyday)));
  await page.getByLabel('Selected card').selectOption('travel');
  await expect(currentBalance).toHaveText(money(cards.travel.balance));
  await expect(availableCredit).toHaveText(money(expectedCredit(cards.travel)));
  await expect(page.locator('.card-art')).toContainText(cards.travel.last4);
});

test('validates and posts a payment, verifies API state and persistence after reload', async ({ page }) => {
  const before = await (await page.request.get('/api/portfolio')).json();
  await page.getByRole('link', { name: 'Make a payment' }).click();
  await page.getByLabel('Payment amount (USD)').fill('0');
  await page.getByRole('button', { name: 'Confirm demo payment' }).click();
  await expect(page.getByRole('alert')).toContainText('Enter an amount');
  await page.getByLabel('Payment amount (USD)').fill('25.00');
  await page.getByRole('button', { name: 'Confirm demo payment' }).click();
  await expect(page.getByRole('status')).toContainText('Demo payment posted');
  await page.reload();
  await expect(overview(page)).toBeVisible();
  await expect(page.locator('.hero .amount')).toHaveText(money(before.cards.everyday.balance - 2500));
  await expect(page.getByRole('button', { name: /Online payment.*-\$25\.00/ })).toBeVisible();
  const after = await (await page.request.get('/api/portfolio')).json();
  expect(after.cards.travel.balance).toBe(before.cards.travel.balance);
  expect(after.cards.everyday.transactions.filter(tx => tx.category === 'Payment' && tx.amount === -2500)).toHaveLength(1);
});

test('filters activity and files a dispute through transaction details', async ({ page }) => {
  await page.getByRole('link', { name: 'Activity', exact: true }).click();
  await page.getByLabel('Show').selectOption('Pending');
  await expect(page.getByRole('button', { name: /Pending/ })).toHaveCount(2);
  await page.getByLabel('Show').selectOption('Posted');
  await page.getByLabel('Search transactions').fill('Studio Fitness');
  await page.getByRole('button', { name: /Studio Fitness/ }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Dispute charge' }).click();
  await dialog.getByLabel('Reason').selectOption('Incorrect amount');
  await dialog.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByRole('status')).toContainText('Demo dispute submitted');
  await page.getByRole('link', { name: 'Disputes', exact: true }).click();
  await expect(page.getByText(/Studio Fitness.*Incorrect amount.*Submitted/)).toBeVisible();
});

test('downloads the selected statement as a CSV', async ({ page }) => {
  await page.getByRole('link', { name: 'Statements', exact: true }).click();
  await page.getByLabel('Statement period').selectOption('1');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download activity CSV' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^statement-2048-\d{4}-\d{2}-\d{2}\.csv$/);
  const csv = await readFile(await download.path(), 'utf8');
  expect(csv.split('\r\n').length).toBeGreaterThan(1);
  expect(csv).toContain('"Date","Description","Category","Amount USD"');
});

test('redeems rewards and updates card settings', async ({ page }) => {
  await page.getByRole('link', { name: 'Rewards', exact: true }).click();
  await page.getByRole('button', { name: 'Redeem points' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Points to redeem').fill('1000');
  await dialog.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByRole('listitem').filter({ hasText: '1,000 points' })).toBeVisible();
  await page.getByRole('link', { name: 'Card services' }).click();
  await page.getByRole('switch', { name: 'Freeze card' }).click();
  await expect(page.getByRole('status')).toContainText('Freeze card updated');
  await page.reload();
  await expect(page.getByRole('switch', { name: 'Freeze card' })).toBeChecked();
  await page.getByLabel('Selected card').selectOption('travel');
  await expect(page.getByRole('switch', { name: 'Freeze card' })).not.toBeChecked();
});
