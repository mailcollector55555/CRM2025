import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const BankAccountList = () => {
  const [bankAccounts, setBankAccounts] = useState([]);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const response = await axios.get('/api/bank-accounts');
        setBankAccounts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des comptes bancaires:', error);
      }
    };

    fetchBankAccounts();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Liste des Comptes Bancaires
        </Typography>
        <Button
          component={Link}
          to="/bank-accounts/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Nouveau Compte
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Société</TableCell>
              <TableCell>Banque</TableCell>
              <TableCell>IBAN</TableCell>
              <TableCell>BIC</TableCell>
              <TableCell>Devise</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bankAccounts.map((account) => (
              <TableRow key={account._id}>
                <TableCell>{account.company?.name}</TableCell>
                <TableCell>{account.bankName}</TableCell>
                <TableCell>
                  {account.iban.replace(/(.{4})/g, '$1 ').trim()}
                </TableCell>
                <TableCell>{account.bic}</TableCell>
                <TableCell>
                  <Chip
                    label={account.currency}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: account.status === 'active' ? 'success.light' : 'error.light',
                      color: 'white',
                      py: 0.5,
                      px: 1,
                      borderRadius: 1,
                      display: 'inline-block'
                    }}
                  >
                    {account.status === 'active' ? 'Actif' : 'Inactif'}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    component={Link}
                    to={`/bank-accounts/${account._id}`}
                    color="primary"
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/bank-accounts/${account._id}/edit`}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default BankAccountList;
