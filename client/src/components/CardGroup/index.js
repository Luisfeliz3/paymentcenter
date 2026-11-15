import React, { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { CreditCard, Refresh } from "@mui/icons-material";
import API from "../../utils/API.js";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function money(value) {
  return typeof value === "number" && Number.isFinite(value) ? usd.format(value) : "Unavailable";
}

function BalanceSummary({ balance }) {
  return (
    <Paper component="section" aria-label="Card balances" elevation={0} sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr" },
      overflow: "hidden",
      border: "1px solid #d9e3f1",
      borderRadius: 3,
    }}>
      <Box sx={{ background: "linear-gradient(125deg, #0a2244, #0b4d87)", color: "white", p: { xs: 2.5, sm: 4 } }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CreditCard aria-hidden="true" />
          <Typography component="h2" sx={{ fontWeight: 600 }}>Current balance</Typography>
        </Stack>
        <Typography component="p" sx={{ fontSize: { xs: "2.2rem", sm: "3rem" }, fontWeight: 750, my: 1 }}>
          {money(balance.total_balance)}
        </Typography>
        <Button component={RouterLink} to="/payment" variant="contained" disableElevation
          sx={{ backgroundColor: "white", color: "#103e6e", "&:hover": { backgroundColor: "#dfedfc" } }}>
          Make a payment
        </Button>
      </Box>
      <Box component="dl" sx={{ m: 0, p: { xs: 2.5, sm: 4 } }}>
        {[
          ["Statement balance", balance.statement_balance],
          ["Minimum payment", balance.minimum_payment],
          ["Available credit", balance.available_credit],
        ].map(([label, value]) => (
          <Box key={label} sx={{
            display: "flex", justifyContent: "space-between", flexWrap: "wrap", columnGap: 2, py: 1.25,
            "& + &": { borderTop: "1px solid #e1e9f4" },
          }}>
            <Typography component="dt" sx={{ color: "#435a77" }}>{label}</Typography>
            <Typography component="dd" sx={{ m: 0, fontWeight: 700 }}>{money(value)}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default function CardGroup() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const { data } = await API.getBalances();
      if (!Array.isArray(data)) throw new Error("Unexpected balance response");
      setBalances(data);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <Stack spacing={2} aria-busy={loading}>
      {balances.map((balance, index) => <BalanceSummary key={balance._id ?? index} balance={balance} />)}
      {loading && <Typography role="status">Loading balances…</Typography>}
      {failed && <Alert severity="error">Could not load the latest balances.</Alert>}
      {!loading && !failed && !balances.length && <Alert severity="info">No balances are available.</Alert>}
      <Box>
        <Button onClick={refresh} disabled={loading} startIcon={<Refresh />}>Refresh balances</Button>
      </Box>
    </Stack>
  );
}
