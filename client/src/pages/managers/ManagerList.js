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
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const ManagerList = () => {
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get('/api/managers');
        setManagers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des gérants:', error);
      }
    };

    fetchManagers();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Liste des Gérants
        </Typography>
        <Button
          component={Link}
          to="/managers/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Nouveau Gérant
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Sociétés</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager._id}>
                <TableCell>{manager.lastName}</TableCell>
                <TableCell>{manager.firstName}</TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>{manager.phone}</TableCell>
                <TableCell>{manager.companies?.length || 0}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: manager.status === 'active' ? 'success.light' : 'error.light',
                      color: 'white',
                      py: 0.5,
                      px: 1,
                      borderRadius: 1,
                      display: 'inline-block'
                    }}
                  >
                    {manager.status === 'active' ? 'Actif' : 'Inactif'}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    component={Link}
                    to={`/managers/${manager._id}`}
                    color="primary"
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/managers/${manager._id}/edit`}
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

export default ManagerList;
