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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import axios from 'axios';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('/api/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des sociétés:', error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Liste des Sociétés
        </Typography>
        <Button
          component={Link}
          to="/companies/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Nouvelle Société
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>N° TVA</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell>Gérants</TableCell>
              <TableCell>Comptes Bancaires</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company._id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.vatNumber}</TableCell>
                <TableCell>{company.address.country}</TableCell>
                <TableCell>
                  {company.managers?.map((manager) => (
                    <Chip
                      key={manager._id}
                      label={`${manager.firstName} ${manager.lastName}`}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <AccountBalanceIcon sx={{ mr: 1 }} />
                    {company.bankAccounts?.length || 0}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: company.status === 'active' ? 'success.light' : 'error.light',
                      color: 'white',
                      py: 0.5,
                      px: 1,
                      borderRadius: 1,
                      display: 'inline-block'
                    }}
                  >
                    {company.status === 'active' ? 'Active' : 'Inactive'}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    component={Link}
                    to={`/companies/${company._id}`}
                    color="primary"
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/companies/${company._id}/edit`}
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

export default CompanyList;
