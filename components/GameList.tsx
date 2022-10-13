import React, { useEffect, useState } from 'react';
import { CircularProgress, Container, List, ListItem } from '@mui/material';
import { User, UsersOnGames } from '@prisma/client';
import { useUser } from '@auth0/nextjs-auth0';
import { getUser, listGames } from 'services/local';
import Link from 'next/link';

export const GameList: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [userWithId, setUserWithId] = useState<User>();
  const [gamesList, setGamesList] = useState<UsersOnGames[]>();

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
      <List>
        {gamesList.map((game) => (
          <ListItem key={game.gameId}>
            <Link href={`/game/${game.gameId}`}>
              <a>Hej här är spel nr {game.gameId}</a>
            </Link>
          </ListItem>
        ))}
      </List>
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
