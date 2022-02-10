import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';
import { Menu } from 'components/Menu';
import { VotingBox } from 'components/VotingBox';
import { useUser } from '@auth0/nextjs-auth0';

const IndexPage: NextPage<{}> = () => {
  const { user, error, isLoading } = useUser();
  return (
    <Container maxWidth="md">
      <Head>
        <title>Jobjörns ordspel</title>
      </Head>
      <Menu />
      {user ? (
        <div>
          Hej {user.name}! <a href="/api/auth/logout">Logga ut</a>
        </div>
      ) : (
        <div>
          Du är inte inloggad. <a href="/api/auth/login">Logga in</a>
        </div>
      )}
    </Container>
  );
};

export default IndexPage;
