import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const MainMenu = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CRM Bancaire
          </Typography>
          
          <Button
            color="inherit"
            component={Link}
            to="/managers"
            startIcon={<PersonIcon />}
          >
            Gérants
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/companies"
            startIcon={<BusinessIcon />}
          >
            Sociétés
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/bank-accounts"
            startIcon={<AccountBalanceIcon />}
          >
            Comptes Bancaires
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainMenu;
