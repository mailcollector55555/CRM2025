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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete
} from '@mui/material';
import axios from 'axios';

const BankAccountForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    company: '',
    bankName: '',
    bankAddress: '',
    accountName: '',
    iban: '',
    bic: '',
    currency: 'EUR',
    status: 'active',
    credentials: {
      username: '',
      password: ''
    }
  });

  const [companies, setCompanies] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les sociétés
        const companiesResponse = await axios.get('/api/companies');
        setCompanies(companiesResponse.data);

        // Charger les pays
        const countriesResponse = await axios.get('/api/data/countries');
        setCountries(countriesResponse.data);

        // Charger les banques
        const banksResponse = await axios.get('/api/data/banks');
        setBanks(banksResponse.data);

        if (isEdit) {
          // Charger les données du compte bancaire
          const accountResponse = await axios.get(`/api/bank-accounts/${id}`);
          setFormData(accountResponse.data);
          setSelectedCompany(accountResponse.data.company);
          setSelectedBank(banks.find(bank => bank.name === accountResponse.data.bankName));
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
        company: selectedCompany._id,
        bankName: selectedBank.name
      };

      if (isEdit) {
        await axios.put(`/api/bank-accounts/${id}`, dataToSend);
      } else {
        await axios.post('/api/bank-accounts', dataToSend);
      }
      navigate('/bank-accounts');
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

  const handleBankChange = (event, newValue) => {
    setSelectedBank(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        bankName: newValue.name,
        bic: newValue.swift
      }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEdit ? 'Modifier le Compte Bancaire' : 'Nouveau Compte Bancaire'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                value={selectedCompany}
                onChange={(event, newValue) => {
                  setSelectedCompany(newValue);
                }}
                options={companies}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Société"
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                value={selectedBank}
                onChange={handleBankChange}
                options={banks}
                getOptionLabel={(option) => `${option.name} (${option.country})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Banque"
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse de la banque"
                name="bankAddress"
                value={formData.bankAddress}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du compte"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IBAN"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                required
                inputProps={{
                  pattern: '^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$',
                  title: 'Format IBAN invalide'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="BIC/SWIFT"
                name="bic"
                value={formData.bic}
                onChange={handleChange}
                required
                inputProps={{
                  pattern: '^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$',
                  title: 'Format BIC invalide'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Devise</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  label="Devise"
                >
                  {countries
                    .map(country => country.currency)
                    .filter((currency, index, self) => self.indexOf(currency) === index)
                    .map(currency => (
                      <MenuItem key={currency} value={currency}>
                        {currency}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
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
                  <MenuItem value="active">Actif</MenuItem>
                  <MenuItem value="inactive">Inactif</MenuItem>
                  <MenuItem value="pending">En attente</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Identifiants de connexion
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Identifiant"
                name="credentials.username"
                value={formData.credentials.username}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mot de passe"
                name="credentials.password"
                type="password"
                value={formData.credentials.password}
                onChange={handleChange}
                required
              />
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
                  onClick={() => navigate('/bank-accounts')}
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

export default BankAccountForm;
