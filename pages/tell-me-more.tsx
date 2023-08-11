import React from 'react';
import { Box } from '@mui/material';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Footer } from 'components/Footer';
import { addUser } from 'services/local';
import Head from 'next/head';
import { faviconString } from 'services/helpers';
import { Loading } from 'components/Loading';
import { TellMeMore } from 'components/TellMeMore';

const TellMeMorePage: NextPage<{}> = () => {
  const { user, isLoading } = useUser(); // härifrån finns också error att ta ut

  if (typeof user !== 'undefined' && isLoading === false) {
    addUser(user);
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
          flexDirection: 'column',
          minHeight: '100%',
          backgroundColor: '#121212'
        }}
      >
        <Head>
          <link rel="icon" href={faviconString()} key="favicon" />
          <title>Berätta mer | Ordbjörn</title>
        </Head>
        <Menu />
        <TellMeMore />
        <Footer />
      </Box>
    </>
  );
};

export default TellMeMorePage;
