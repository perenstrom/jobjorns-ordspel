import React from 'react';
import { Box, CircularProgress, Container } from '@mui/material';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import { useUser } from '@auth0/nextjs-auth0';
import { GameList } from 'components/GameList';
import { Footer } from 'components/Footer';
import { Splash } from 'components/Splash';
import { addUser } from 'services/local';
import Head from 'next/head';
import { faviconString } from 'services/helpers';

const IndexPage: NextPage<{}> = () => {
  const { user, isLoading } = useUser(); // härifrån finns också error att ta ut

  if (typeof user !== 'undefined' && isLoading === false) {
    addUser(user);
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
          flexDirection: 'column',
          minHeight: '90vh',
          backgroundColor: '#121212'
        }}
      >
        <Head>
          <title>Jobjörns ordspel</title>
          <link rel="icon" href={faviconString()} key="favicon" />
        </Head>
        {isLoading ? (
          <Container maxWidth="sm">
            <CircularProgress />
          </Container>
        ) : user ? (
          <>
            <Menu />
            <GameList />
          </>
        ) : (
          <Splash />
        )}
        <Footer />
      </Box>
    </>
  );
};

export default IndexPage;
