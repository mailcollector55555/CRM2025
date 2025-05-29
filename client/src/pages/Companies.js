import React from 'react';
import { Container, Typography } from '@mui/material';

const Companies = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des entreprises
      </Typography>
      <Typography variant="body1">
        La liste des entreprises sera affichée ici.
      </Typography>
    </Container>
  );
};

export default Companies;
