import React from 'react';
import { Box, CircularProgress, Container } from '@mui/material';
import { Menu } from './Menu';
import { Footer } from './Footer';
import Head from 'next/head';
import { faviconString } from 'services/helpers';
import { useUser } from '@auth0/nextjs-auth0';

export const Loading: React.FC<{}> = () => {
  const { user, isLoading } = useUser(); // härifrån finns också error att ta ut

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#121212'
      }}
    >
      <Head>
        <title>Jobjörns ordspel</title>
        <link rel="icon" href={faviconString()} key="favicon" />
      </Head>
      {user && !isLoading && <Menu />}
      <Container maxWidth="sm" style={{ textAlign: 'center' }}>
        <CircularProgress />
      </Container>
      <Footer />
    </Box>
  );
};
