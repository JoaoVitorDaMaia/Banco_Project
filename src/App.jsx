import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  Grid,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";

function App() {
  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* HEADER */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #5f2c82, #49a09d)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography variant="h6">Finance Dashboard</Typography>

          <Box>
            <Button color="inherit">Dashboard</Button>
            <Button color="inherit">Transactions</Button>
            <Button color="inherit">Profile</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 3, md: 6 },
        }}
      >
        {/* WELCOME */}
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}
          >
            Welcome Back!
          </Typography>

          <Typography color="text.secondary">Hi, Expens Sampson</Typography>
        </Box>

        <Grid container spacing={4}>
          {/* CARD TOTAL */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography color="text.secondary">
                  Total Expenditure
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  mt={1}
                  sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}
                >
                  $60,000.00
                </Typography>

                {/* Gráfico Fake Responsivo */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    mt: 4,
                    height: { xs: 120, md: 200 },
                  }}
                >
                  {[80, 120, 150, 200, 140, 100, 160].map((height, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: { xs: 15, md: 35 },
                        height: height / 1.5,
                        bgcolor: index === 3 ? "#1976d2" : "#e0e0e0",
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SUMMARY */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Summary
                </Typography>

                <Typography mt={3}>
                  Income: <b>$12,000</b>
                </Typography>

                <Typography mt={2}>
                  Expenses: <b>$8,500</b>
                </Typography>

                <Typography mt={2}>
                  Savings: <b>$3,500</b>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* TRANSACTIONS */}
        <Card sx={{ mt: 6, borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Recent Transactions
            </Typography>

            {[
              {
                name: "Wisteria Ravenclaw",
                type: "Money Out",
                value: "- $1120.00",
                color: "error.main",
              },
              {
                name: "Jake Weary",
                type: "Money In",
                value: "+ $3150.00",
                color: "success.main",
              },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ mr: 2 }} />
                  <Box>
                    <Typography fontWeight="bold">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.type}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    color: item.color,
                    fontWeight: "bold",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default App;
