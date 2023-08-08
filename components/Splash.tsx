import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

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
        <Stack
          sx={{ pt: 4 }}
          direction="row"
          spacing={2}
          justifyContent="center"
        >
          <Button variant="contained" href="/api/auth/login">
            Logga in
          </Button>
          <Button variant="outlined">Berätta mer</Button>
        </Stack>
      </Container>
    </Box>
  );
};
