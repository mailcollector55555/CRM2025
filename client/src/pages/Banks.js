import React from 'react';
import { Container, Typography } from '@mui/material';

const Banks = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des banques
      </Typography>
      <Typography variant="body1">
        La liste des banques sera affichée ici.
      </Typography>
    </Container>
  );
};

export default Banks;
