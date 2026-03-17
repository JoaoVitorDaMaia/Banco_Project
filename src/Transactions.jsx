import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Avatar,
    Grid,
    TextField,
    MenuItem,
  } from "@mui/material";
  
  const transactions = [
    {
      name: "Netflix",
      type: "Expense",
      value: "- $50.00",
      color: "error.main",
      date: "10 Mar 2026",
    },
    {
      name: "Salary",
      type: "Income",
      value: "+ $3000.00",
      color: "success.main",
      date: "08 Mar 2026",
    },
  ];
  
  function Transactions() {
    return (
      <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Transactions
          </Typography>
  
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Search..." />
            </Grid>
  
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Type">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </Grid>
          </Grid>
  
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              {transactions.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ mr: 2 }} />
                    <Box>
                      <Typography fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2">
                        {item.type}
                      </Typography>
                    </Box>
                  </Box>
  
                  <Typography
                    sx={{ color: item.color, fontWeight: "bold" }}
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
  
  export default Transactions;