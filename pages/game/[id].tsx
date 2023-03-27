import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import {
  useUser,
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Footer } from 'components/Footer';
import { getGame, getUser } from 'services/local';
import { GameWithEverything } from 'types/types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import router from 'next/router';
import { Board } from 'components/Board';
import { User } from '@prisma/client';
import { ScoreList } from 'components/ScoreList';

const NewGamePage: NextPage<{}> = () => {
  const [game, setGame] = useState<GameWithEverything>();
  const [userWithId, setUserWithId] = useState<User>();

  const { user } = useUser();

  const gameId = parseInt(router.query.id as string, 10);

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

  const fetchGame = async (gameId: number) => {
    if (gameId > 0) {
      const newGame = await getGame(gameId);

      if (newGame.success) {
        setGame(newGame.data);
      }
    }
  };

  useEffect(() => {
    let t1 = performance.now();
    console.log(
      t1,
      'nu kör vi useeffecten som kör fetchgame i [id].tsx',
      gameId
    );
    fetchGame(gameId);
  }, [gameId]);

  if (game && userWithId) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#121212'
        }}
      >
        <Menu />
        <Container maxWidth="sm">
          <Board game={game} user={userWithId} fetchGame={fetchGame} />
          <ScoreList game={game} />
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
