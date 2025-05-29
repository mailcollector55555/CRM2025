import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import axios from 'axios';

const CompanyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    vatNumber: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    managers: [],
    status: 'active'
  });

  const [availableManagers, setAvailableManagers] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les gérants disponibles
        const managersResponse = await axios.get('/api/managers');
        setAvailableManagers(managersResponse.data);

        if (isEdit) {
          // Charger les données de la société
          const companyResponse = await axios.get(`/api/companies/${id}`);
          setFormData(companyResponse.data);
          setSelectedManagers(companyResponse.data.managers || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        managers: selectedManagers.map(manager => manager._id)
      };

      if (isEdit) {
        await axios.put(`/api/companies/${id}`, dataToSend);
      } else {
        await axios.post('/api/companies', dataToSend);
      }
      navigate('/companies');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEdit ? 'Modifier la Société' : 'Nouvelle Société'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de la société"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro d'enregistrement"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro de TVA"
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Adresse
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rue"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ville"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code postal"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pays"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="managers"
                options={availableManagers}
                value={selectedManagers}
                onChange={(event, newValue) => {
                  setSelectedManagers(newValue);
                }}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Gérants"
                    placeholder="Sélectionner les gérants"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={`${option.firstName} ${option.lastName}`}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Statut"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspendue</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {isEdit ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="outlined"
                  onClick={() => navigate('/companies')}
                >
                  Annuler
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CompanyForm;
