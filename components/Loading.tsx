import React from 'react';
import { Box, CircularProgress, Container } from '@mui/material';
import { Menu } from './Menu';
import { Footer } from './Footer';
import Head from 'next/head';
import { faviconString } from 'services/helpers';

export const Loading: React.FC<{}> = () => {
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
      <Menu />
      <Container maxWidth="sm" style={{ textAlign: 'center' }}>
        <CircularProgress />
      </Container>
      <Footer />
    </Box>
  );
};
