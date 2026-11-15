import { randomUUID } from "node:crypto";

export function demoPortfolio(id, today = new Date()) {
  const day = offset => new Date(+today + offset * 86400000).toISOString().slice(0, 10);
  const merchants = [
    ["Cedar & Rye", "Dining", 7824], ["Union Market", "Groceries", 14633],
    ["Metro Transit", "Transportation", 290], ["Northline Hotel", "Travel", 28600],
    ["Paper Mill Books", "Shopping", 3295], ["Studio Fitness", "Health", 6500],
    ["Morning Bell Coffee", "Dining", 1585], ["Harbor Wireless", "Bills", 8900],
    ["Atlas Air", "Travel", 34820], ["Riverside Pharmacy", "Health", 2218],
    ["Sunday Supply", "Shopping", 5910], ["Borough Cinema", "Entertainment", 3800],
  ];
  function card(key, name, last4, limit, opening, points, scale) {
    const transactions = Array.from({ length: 36 }, (_, i) => {
      const [merchant, category, amount] = merchants[(i + scale) % merchants.length];
      return { id: randomUUID(), merchant, category, amount: Math.round(amount * scale),
        date: day(-2 * i), status: i < 2 ? "Pending" : "Posted" };
    });
    for (const [offset, amount] of [[-28, 55000], [-58, 71000]]) {
      transactions.push({ id: randomUUID(), merchant: "Online payment",
        category: "Payment", amount: -amount, date: day(offset), status: "Posted" });
    }
    transactions.sort((a, b) => b.date.localeCompare(a.date));
    let previous = opening;
    const statements = [];
    for (const end of [-61, -31, -1]) {
      const start = end - 29;
      const rows = transactions.filter(t => t.status === "Posted" && t.date >= day(start) && t.date <= day(end));
      const balance = previous + rows.reduce((sum, t) => sum + t.amount, 0);
      statements.unshift({ id: day(end), from: day(start), through: day(end), due: day(end + 25),
        previous, balance, minimum: Math.min(Math.max(0, balance), Math.max(3500, Math.round(balance * .02))), rows });
      previous = balance;
    }
    return { key, name, last4, limit, balance: previous, points, transactions, statements,
      frozen: false, autopay: false, alerts: true, disputes: [], redemptions: [] };
  }
  return { _id: id, name: "Jordan Taylor", cards: {
    everyday: card("everyday", "Everyday Rewards", "2048", 1200000, 135000, 34820, 1),
    travel: card("travel", "Travel Rewards", "7316", 2000000, 220000, 58760, 2),
  } };
}
