import React from 'react';
import { Box } from '@mui/material';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import { Footer } from 'components/Footer';
import Head from 'next/head';
import { faviconString } from 'services/helpers';
import { Policy } from 'components/Policy';

const PolicyPage: NextPage<{}> = () => {
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
          <title>Integritets- och cookie-policy | Ordbjörn</title>
        </Head>
        <Menu />
        <Policy />
        <Footer />
      </Box>
    </>
  );
};

export default PolicyPage;
