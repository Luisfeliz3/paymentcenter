import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";

const format = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const money = amount => format.format(amount / 100);
const date = value => new Date(value + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const reasons = ["Unrecognized charge", "Incorrect amount", "Duplicate charge"];
const links = [["/dashboard", "Overview"], ["/activity", "Activity"], ["/statements", "Statements"], ["/rewards", "Rewards"], ["/accountservices", "Card services"]];

async function request(path, method = "GET", data) {
  const result = await fetch("/api/" + path, {
    method, ...(data && { headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  });
  if (!result.headers.get("content-type")?.includes("application/json")) throw new Error("Could not reach Payment Center.");
  const body = await result.json();
  if (!result.ok) {
    const error = new Error(body.error);
    error.status = result.status;
    throw error;
  }
  return body;
}

function Transactions({ rows, disputes, select }) {
  if (!rows.length) return <p className="empty">No matching transactions.</p>;
  return <ul className="transactions">{rows.map(tx => <li key={tx.id}>
    <button onClick={() => select("transaction", tx)} className="tx">
      <span className="tx-icon" aria-hidden="true">{tx.amount < 0 ? "↙" : "▤"}</span>
      <span><strong>{tx.merchant}</strong><small>{tx.category} · {date(tx.date)}</small></span>
      <span className={tx.amount < 0 ? "credit" : ""}><strong>{money(tx.amount)}</strong>
        <small>{disputes.some(d => d.transactionId === tx.id) ? "Disputed" : tx.status}</small></span>
    </button>
  </li>)}</ul>;
}

function amountDue(card) {
  const statement = card.statements[0];
  const paid = -card.transactions.filter(tx => tx.category === "Payment" && tx.date > statement.through)
    .reduce((sum, tx) => sum + tx.amount, 0);
  return { minimum: Math.max(0, statement.minimum - paid), statement: Math.max(0, statement.balance - paid) };
}

function Overview({ card, name, select }) {
  const statement = card.statements[0];
  const pending = card.transactions.filter(tx => tx.status === "Pending").reduce((sum, tx) => sum + tx.amount, 0);
  return <>
    <h1>Welcome back, {name.split(" ")[0]}</h1>
    <div className="hero-grid">
      <section className="hero">
        <div><span>Current balance</span><strong className="amount">{money(card.balance)}</strong>
          <p>Excludes {money(pending)} in pending charges</p>
          <NavLink className="primary white" to="/payment">Make a payment <span aria-hidden="true">→</span></NavLink>
        </div>
        <div className="card-art"><b>PAYMENT CENTER</b><span className="chip" /><span>•••• {card.last4}</span><small>{name.toUpperCase()}</small></div>
      </section>
      <section className="panel summary">
        <h2>Payment summary</h2>
        <dl><dt>Statement balance</dt><dd>{money(statement.balance)}</dd>
          <dt>Minimum remaining</dt><dd>{money(amountDue(card).minimum)}</dd>
          <dt>Due date</dt><dd>{date(statement.due)}</dd>
          <dt>Available credit</dt><dd>{money(card.limit - card.balance - pending)}</dd></dl>
      </section>
    </div>
    <div className="below-grid">
      <section className="panel"><div className="section-title"><h2>Recent activity</h2><NavLink to="/activity">View all activity →</NavLink></div>
        <Transactions rows={card.transactions.slice(0, 6)} disputes={card.disputes} select={select} />
      </section>
      <section className="panel"><h2>Rewards</h2><p className="points">{card.points.toLocaleString()}</p>
        <p className="muted">Points available</p><NavLink to="/rewards">View your rewards →</NavLink></section>
    </div>
  </>;
}

function Activity({ card, select }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const rows = card.transactions.filter(tx =>
    (filter === "All" || (filter === "Payments" ? tx.category === "Payment" : tx.status === filter)) &&
    (tx.merchant + " " + tx.category).toLowerCase().includes(query.trim().toLowerCase()));
  return <><h1>Activity</h1><section className="panel">
    <div className="filters"><label>Search transactions<input placeholder="Merchant or category" value={query} onChange={e => setQuery(e.target.value)} /></label>
      <label>Show<select value={filter} onChange={e => setFilter(e.target.value)}>
        {["All", "Posted", "Pending", "Payments"].map(value => <option key={value}>{value}</option>)}</select></label></div>
    <p className="muted">{rows.length} transactions</p>
    <Transactions rows={rows} disputes={card.disputes} select={select} />
  </section></>;
}

function Statements({ card }) {
  const [index, setIndex] = useState(0);
  const statement = card.statements[index];
  function download() {
    const cell = value => '"' + String(value).replaceAll('"', '""') + '"';
    const csv = [["Date", "Description", "Category", "Amount USD"], ...statement.rows.map(tx =>
      [tx.date, tx.merchant, tx.category, (tx.amount / 100).toFixed(2)])].map(row => row.map(cell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "statement-" + card.last4 + "-" + statement.through + ".csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <><h1>Statements</h1><section className="panel narrow">
    <label>Statement period<select value={index} onChange={e => setIndex(Number(e.target.value))}>
      {card.statements.map((item, i) => <option key={item.id} value={i}>{date(item.from)} – {date(item.through)}</option>)}</select></label>
    <dl><dt>Previous balance</dt><dd>{money(statement.previous)}</dd>
      <dt>Statement balance</dt><dd>{money(statement.balance)}</dd>
      <dt>Minimum at closing</dt><dd>{money(statement.minimum)}</dd>
      <dt>Payment due</dt><dd>{date(statement.due)}</dd></dl>
    <button className="primary" onClick={download}>Download activity CSV</button>
  </section></>;
}

function Services({ card, save, busy }) {
  const preferences = [["frozen", "Freeze card", "Save the lock status for this demo card."],
    ["autopay", "AutoPay preference", "Save your preference for automatic demo payments."],
    ["alerts", "Account alerts", "Save your preference for payment reminders."]];
  return <><h1>Card services</h1><section className="panel narrow">
    {preferences.map(([key, title, text]) => <div className="control" key={key}><div><strong>{title}</strong><p className="muted">{text}</p></div>
      <button className="switch" role="switch" aria-label={title} aria-checked={card[key]} disabled={busy}
        onClick={() => save("settings", { [key]: !card[key] }, title + " updated.", "PATCH")}>{card[key] ? "On" : "Off"}</button></div>)}
  </section></>;
}

function AccountDialog({ modal, close, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    element.showModal();
    return () => element.close();
  }, []);
  const titles = { transaction: "Transaction details", dispute: "Dispute this charge", points: "Redeem points" };
  return <dialog ref={ref} aria-labelledby="modal-title" onCancel={event => { event.preventDefault(); close(); }}>
    <div className="section-title"><h2 id="modal-title">{titles[modal.type]}</h2><button className="close" aria-label="Close dialog" onClick={close}>×</button></div>
    {children}
  </dialog>;
}

function Payment({ card, save, busy }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const requestId = useRef(crypto.randomUUID());
  const navigate = useNavigate();
  const due = amountDue(card);
  async function submit(event) {
    event.preventDefault();
    const amount = Math.round(Number(value) * 100);
    if (!/^\d+(\.\d{1,2})?$/.test(value) || amount < 1 || amount > card.balance) {
      return setError("Enter an amount between $0.01 and the current balance.");
    }
    setError("");
    if (await save("payments", { amount, requestId: requestId.current }, "Demo payment posted for " + money(amount) + ".")) navigate("/dashboard");
  }
  return <><h1>Make a payment</h1><section className="panel narrow">
    <p>Current balance <strong>{money(card.balance)}</strong></p>
    <p className="muted">Pay from the simulated checking account ending in 9921.</p>
    {card.balance > 0 && <form onSubmit={submit}>
      <div className="filters" aria-label="Suggested payment amounts">
        {[["Minimum remaining", due.minimum], ["Statement remaining", due.statement], ["Current balance", card.balance]]
          .filter(([, amount]) => amount > 0 && amount <= card.balance).map(([label, amount]) =>
            <button key={label} className="secondary" type="button" onClick={() => setValue((amount / 100).toFixed(2))}>{label} · {money(amount)}</button>)}
      </div>
      <label>Payment amount (USD)<input required inputMode="decimal" value={value} onChange={e => setValue(e.target.value)} /></label>
      {error && <p role="alert" className="error">{error}</p>}
      <button className="primary" disabled={busy}>{busy ? "Posting…" : "Confirm demo payment"}</button>
    </form>}
  </section></>;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await request("auth/login", "POST", { email, password });
      await onLogin();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <section className="panel login-panel">
    <h1>Sign in to your account</h1>
    <p className="muted">Welcome to Payment Center. Access your cards, payments, and account activity.</p>
    <form onSubmit={submit}>
      <label>Email address<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
    <details className="demo-credentials"><summary>Jordan’s demo login</summary>
      <p>Email · jordan@example.com</p><p>Password · JordanDemo!2026</p>
    </details>
  </section>;
}

function Center() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [portfolio, setPortfolio] = useState(null);
  const [key, setKey] = useState("everyday");
  const [modal, setModal] = useState(null);
  const [value, setValue] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const loading = useRef(false);
  const card = portfolio?.cards[key];
  async function load() {
    if (loading.current) return;
    loading.current = true;
    setError("");
    try { setPortfolio(await request("portfolio")); }
    catch (err) {
      if (err.status === 401) { setPortfolio(null); navigate("/login", { replace: true }); }
      else setError(err.message);
    }
    finally { loading.current = false; setChecking(false); }
  }
  useEffect(() => { load(); }, []);
  function select(type, tx) {
    setValue(type === "dispute" ? reasons[0] : "");
    setError("");
    setModal({ type, tx, id: crypto.randomUUID() });
  }
  async function save(path, body, message, method = "POST") {
    if (inFlight.current) return false;
    inFlight.current = true;
    setBusy(true);
    setNotice("");
    setError("");
    try {
      setPortfolio(await request("cards/" + key + "/" + path, method, body));
      setModal(null);
      setNotice(message);
      return true;
    } catch (err) {
      setError(err.message);
      if (err.status === 401) { setPortfolio(null); setModal(null); navigate("/login", { replace: true }); }
      return false;
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      await request("auth/logout", "POST", {});
      setPortfolio(null); setModal(null); setNotice(""); setError(""); setKey("everyday");
      navigate("/login", { replace: true });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  async function signedIn() {
    const data = await request("portfolio");
    setPortfolio(data); setNotice(""); setError("");
    navigate("/dashboard", { replace: true });
  }
  const close = () => { if (!busy) { setModal(null); setError(""); } };
  const disputed = modal?.tx && card.disputes.find(item => item.transactionId === modal.tx.id);
  function submitModal(event) {
    event.preventDefault();
    if (modal.type === "points") save("rewards", { points: Number(value), requestId: modal.id }, "Demo points redeemed.");
    else save("disputes", { transactionId: modal.tx.id, reason: value }, "Demo dispute submitted.");
  }
  return <>
    <header><div className="shell masthead"><NavLink to="/dashboard" className="brand"><span aria-hidden="true">▰</span> Payment Center</NavLink>
      <div className="account-menu"><span className="demo-label">{portfolio ? portfolio.name : "Demo account"}</span>
        {portfolio && <button className="secondary" onClick={logout} disabled={busy}>Sign out</button>}</div></div></header>
    {portfolio && <nav className="nav" aria-label="Account"><div className="shell">{links.map(([href, label]) => <NavLink key={href} to={href}>{label}</NavLink>)}</div></nav>}
    <main className="shell">
      {portfolio && <label className="card-picker">Selected card<select value={key} disabled={busy} onChange={e => {
        setKey(e.target.value); setError(""); setNotice(""); setModal(null);
      }}>{Object.values(portfolio.cards).map(item => <option value={item.key} key={item.key}>{item.name} · •••• {item.last4}</option>)}</select></label>}
      {notice && <p className="notice" role="status">{notice}</p>}
      {error && !modal && <p className="error" role="alert">{error}</p>}
      {checking && <p role="status">Checking your session…</p>}
      {!checking && !card && <Routes>
        <Route path="/login" element={<Login onLogin={signedIn} />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>}
      {card && <Routes>
        <Route path="/dashboard" element={<Overview card={card} name={portfolio.name} select={select} />} />
        <Route path="/payment" element={<Payment key={key} card={card} save={save} busy={busy} />} />
        <Route path="/activity" element={<Activity card={card} select={select} />} />
        <Route path="/statements" element={<Statements key={key} card={card} />} />
        <Route path="/rewards" element={<><h1>Rewards</h1><section className="panel narrow"><h2>Available points</h2>
          <p className="points">{card.points.toLocaleString()}</p><button className="primary" disabled={card.points < 1000} onClick={() => select("points")}>Redeem points</button>
          {card.redemptions.length > 0 && <><h3>Redemption history</h3><ul>{[...card.redemptions].reverse().map(item =>
            <li key={item.id}>{item.points.toLocaleString()} points · {date(item.date)}</li>)}</ul></>}
        </section></>} />
        <Route path="/accountservices" element={<Services card={card} save={save} busy={busy} />} />
        <Route path="/account-management" element={<Navigate replace to="/accountservices" />} />
        <Route path="/disputes" element={<><h1>Disputes</h1><section className="panel narrow">
          {card.disputes.length ? <ul>{card.disputes.map(item => <li key={item.transactionId}>
            {card.transactions.find(tx => tx.id === item.transactionId)?.merchant} · {item.reason} · {item.status}</li>)}</ul> :
            <p>You have no open disputes for this card.</p>}
          <NavLink to="/activity">Find a charge in your activity →</NavLink>
        </section></>} />
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Routes>}
    </main>
    <footer className="shell"><NavLink to="/disputes">Disputes</NavLink><span>Fictional accounts and simulated payments</span></footer>
    {modal && card && <AccountDialog modal={modal} close={close}>
      {modal.type === "transaction" ? <>
        <dl><dt>Merchant</dt><dd>{modal.tx.merchant}</dd><dt>Amount</dt><dd>{money(modal.tx.amount)}</dd>
          <dt>Date</dt><dd>{date(modal.tx.date)}</dd><dt>Status</dt><dd>{modal.tx.status}</dd></dl>
        {disputed && <p>Dispute {disputed.status.toLowerCase()} · {disputed.reason}</p>}
        {!disputed && modal.tx.status === "Posted" && modal.tx.amount > 0 &&
          <button className="secondary" onClick={() => select("dispute", modal.tx)}>Dispute charge</button>}
      </> : <form onSubmit={submitModal}>
        {modal.type === "dispute" ? <label>Reason<select value={value} onChange={e => setValue(e.target.value)}>
          {reasons.map(reason => <option key={reason}>{reason}</option>)}</select></label> :
          <label>Points to redeem<input type="number" min="1000" max={card.points} step="1000" required value={value} onChange={e => setValue(e.target.value)} /></label>}
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" disabled={busy}>{busy ? "Saving…" : "Confirm"}</button>
      </form>}
    </AccountDialog>}
  </>;
}

export default function App() {
  return <BrowserRouter><Center /></BrowserRouter>;
}

