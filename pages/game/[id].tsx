import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import {
  useUser,
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Footer } from 'components/Footer';
import { getUser } from 'services/local';
import { User } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import router from 'next/router';
import { Board } from 'components/Board';
import { Typography } from '@mui/material';

const NewGamePage: NextPage<{}> = () => {
  const [userWithId, setUserWithId] = useState<User>();

  const { user } = useUser();

  const gameId = router.query.id;

  useEffect(() => {
    const fetchUserWithId = async () => {
      if (user && user.email) {
        const newUserWithId = await getUser(user.email);

        if (newUserWithId.success) {
          setUserWithId(newUserWithId.data);
        }
      }
    };

    fetchUserWithId();
  }, [user]);

  if (userWithId) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          height: '100vh'
        }}
      >
        <Menu />
        <Container maxWidth="sm">
          <Typography variant="h2">Spel {gameId}</Typography>
          <Board />
        </Container>
        <Footer />
      </Box>
    );
  } else {
    return (
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
    );
  }
};

export default withPageAuthRequired<WithPageAuthRequiredProps>(NewGamePage);
