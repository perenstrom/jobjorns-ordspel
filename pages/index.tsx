import React from 'react';
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import { useUser } from '@auth0/nextjs-auth0';
import { Board } from 'components/Board';

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'© '}
      <Link color="inherit" href="https://jobjorn.se/">
        Jobjörn Folkesson
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const IndexPage: NextPage<{}> = () => {
  const { user, error, isLoading } = useUser();

  return user ? (
    <>
      <Menu />
      <Container maxWidth="md">
        <Box>
          <Paper>
            <Board />
          </Paper>
        </Box>
      </Container>
    </>
  ) : (
    <>
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
            Jobjörns ordspel
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            Här kan du prova Jobjörns ordspel!
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
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Copyright />
      </Box>
    </>
  );
};

export default IndexPage;
