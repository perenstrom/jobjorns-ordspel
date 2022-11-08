import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Typography
} from '@mui/material';
import { DateTime } from 'luxon';
import { User } from '@prisma/client';
import { useUser } from '@auth0/nextjs-auth0';
import { getUser, listGames } from 'services/local';
import Link from 'next/link';
import { GamesWithUsersWithUsers } from 'types/types';

export const GameList: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [userWithId, setUserWithId] = useState<User>();
  const [gamesList, setGamesList] = useState<GamesWithUsersWithUsers[]>();

  const { user } = useUser();

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

  useEffect(() => {
    const fetchGamesList = async () => {
      if (userWithId && userWithId.id) {
        const newGamesList = await listGames(userWithId.id);

        if (newGamesList.success) {
          setGamesList(newGamesList.data);
          setLoading(false);
          console.log(newGamesList.data);
        }
      }
    };

    fetchGamesList();
  }, [userWithId]);

  if (gamesList && !loading) {
    console.log('gamesList', gamesList);
    return (
      <Container maxWidth="sm">
        <Typography variant="h3">Pågående spel</Typography>
        {gamesList.map((game) => (
          <Link key={game.id} passHref href={`/game/${game.id}`}>
            <CardActionArea>
              <Card variant="outlined" sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <CardContent sx={{ flexGrow: 0 }}>
                    <Typography variant="h5">{game.id}</Typography>
                  </CardContent>
                  <CardContent>
                    <Typography>
                      {game.users.map((user) => (
                        <span key={user.userId}>{user.user.name}</span>
                      ))}
                    </Typography>
                    <Typography>senaste ordet</Typography>
                    <Typography>
                      {DateTime.fromISO(new Date(game.startedAt).toISOString())
                        .setLocale('sv')
                        .toRelative()}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </CardActionArea>
          </Link>
        ))}
      </Container>
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

/*

                    {Duration.fromISO(
                      new Date(game.createdAt).toISOString()
                    ).toHuman({ listStyle: 'long' })}


                    {Duration.fromISO('2022-09-12T19:10:59.633Z').toHuman({
                      listStyle: 'long'
                    })}
                    


                    {Duration.fromISO('2022-09-12T19:10:59.633Z').toHuman({ listStyle: 'long' })}
                    */
