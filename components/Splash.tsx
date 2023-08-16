import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

export const Splash: React.FC<{}> = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6
      }}
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Ordbjörn
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
        >
          Här kan du prova Jobjörns ordspel, Ordbjörn!
        </Typography>
        <Box
          sx={{
            pt: 4,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <Button
            sx={{ mt: 1, ml: 1 }}
            variant="contained"
            href="/api/auth/login"
          >
            Logga in
          </Button>
          <Button
            sx={{ mt: 1, ml: 1 }}
            variant="contained"
            href="/api/auth/login"
          >
            Registrera dig
          </Button>
          <Button sx={{ mt: 1, ml: 1 }} variant="outlined" href="/tell-me-more">
            Berätta mer
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
