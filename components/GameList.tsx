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
import { GameWithUsersWithUsers } from 'types/types';

export const GameList: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [userWithId, setUserWithId] = useState<User>();
  const [gamesList, setGamesList] = useState<GameWithUsersWithUsers[]>();

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
        }
      }
    };

    fetchGamesList();
  }, [userWithId]);

  if (gamesList && !loading && userWithId) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h3">Pågående spel</Typography>
        {gamesList.map((game) => (
          <Link key={game.id} passHref href={`/game/${game.id}`}>
            <CardActionArea>
              <Card variant="outlined" sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography>
                      {game.users.map(
                        (user) =>
                          user.userId !== userWithId.id && (
                            <span key={user.userId}>{user.user.name}</span>
                          )
                      )}
                    </Typography>
                    <Typography>{game.latestWord}</Typography>
                    <Typography>
                      {DateTime.fromISO(new Date(game.startedAt).toISOString())
                        .setLocale('sv')
                        .toRelative()}
                    </Typography>
                  </CardContent>
                  <CardContent sx={{ flexGrow: 0 }}>
                    <Typography>{game.id}</Typography>
                  </CardContent>
                </Box>
              </Card>
            </CardActionArea>
          </Link>
        ))}
        {gamesList.length == 0 && (
          <Typography>Du har inga pågående spel.</Typography>
        )}
      </Container>
    );
  } else {
    return (
      <Container maxWidth="sm">
        <Typography variant="h3">Pågående spel</Typography>
        <CircularProgress />
      </Container>
    );
  }
};
