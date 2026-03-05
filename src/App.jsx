import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Meu Projeto
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Box mt={5}>
          <Typography variant="h3" gutterBottom>
            Página Inicial
          </Typography>
          <Typography>Essa é minha primeira página usando MUI 🚀</Typography>
        </Box>
      </Container>
    </>
  );
}

export default App;
