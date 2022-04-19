import React from 'react';
import { Box, CircularProgress, Container } from '@mui/material';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import { useUser } from '@auth0/nextjs-auth0';
import { GameList } from 'components/GameList';
import { Footer } from 'components/Footer';
import { Splash } from 'components/Splash';
import { addUser } from 'services/local';

const IndexPage: NextPage<{}> = () => {
  const { user, isLoading } = useUser(); // härifrån finns också error att ta ut

  console.log('user', user);

  if (typeof user !== 'undefined' && isLoading === false) {
    addUser(user);
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          height: '100vh'
        }}
      >
        {isLoading ? (
          <Container
            maxWidth="sm"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row'
            }}
          >
            <CircularProgress />
          </Container>
        ) : user ? (
          <>
            <Menu />
            <Container maxWidth="sm">
              <GameList />
            </Container>
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
