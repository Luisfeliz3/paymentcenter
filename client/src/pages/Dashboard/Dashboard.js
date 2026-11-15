import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { ArrowForward, CreditCard, ReceiptLong, Settings } from "@mui/icons-material";
import CardGroup from "../../components/CardGroup";
import RecentActivity from "../../components/RecentActivity/RecentActivity";

export default function Dashboard() {
  return (
    <Box component="main" sx={{ bgcolor: "#edf2f9", minHeight: "100vh", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 750, color: "#102849" }}>
              Account overview
            </Typography>
            <Typography sx={{ color: "#435a77", mt: 0.5 }}>
              View your balances, make a payment, and review card activity.
            </Typography>
          </Box>
          <CardGroup />
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" component="nav" aria-label="Account shortcuts">
            <Button component={RouterLink} to="/account-management" startIcon={<CreditCard />}>Manage account</Button>
            <Button component={RouterLink} to="/accountservices" startIcon={<Settings />}>Account services</Button>
            <Button component={RouterLink} to="/disputes" startIcon={<ReceiptLong />}>Disputes</Button>
          </Stack>
          <Paper component="section" aria-label="Transactions" elevation={0}
            sx={{ border: "1px solid #d9e3f1", borderRadius: 3, p: { xs: 1.5, sm: 2.5 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>Transactions</Typography>
              <Button component={RouterLink} to="/activity" endIcon={<ArrowForward />}>View all activity</Button>
            </Stack>
            <RecentActivity width="100%" top={0} />
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
