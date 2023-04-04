import React, { useEffect, useState } from 'react';
import { CircularProgress, Container, Grid, Typography } from '@mui/material';
import { User } from '@prisma/client';
import { useUser } from '@auth0/nextjs-auth0';
import { getUser, listGames } from 'services/local';
import { GameWithEverything } from 'types/types';
import { GameListCard } from './GameListCard';

export const GameList: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [userWithId, setUserWithId] = useState<User>();
  const [gamesList, setGamesList] = useState<GameWithEverything[]>([]);
  const [gamesListReady, setGamesListReady] = useState<GameWithEverything[]>(
    []
  );
  const [gamesListWaiting, setGamesListWaiting] = useState<
    GameWithEverything[]
  >([]);

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
        let newGamesListWaiting: GameWithEverything[] = [];
        let newGamesListReady: GameWithEverything[] = [];

        if (newGamesList.success) {
          newGamesList.data.map((game) => {
            if (
              game.turns[0] &&
              game.turns[0].moves.findIndex(
                (move) => move.userId == userWithId.id
              ) > -1
            ) {
              newGamesListWaiting.push(game);
            } else {
              newGamesListReady.push(game);
            }
          });

          setGamesListWaiting(newGamesListWaiting);
          setGamesListReady(newGamesListReady);
          setGamesList(newGamesList.data);
          setLoading(false);
        }
      }
    };

    fetchGamesList();
  }, [userWithId]);

  if (gamesList && !loading && userWithId) {
    return (
      <Container maxWidth="md">
        {gamesListReady.length > 0 && (
          <Typography variant="h4" sx={{ my: 3 }}>
            Väntar på ditt drag
          </Typography>
        )}
        <Grid container spacing={2}>
          {gamesListReady.map((game) => (
            <GameListCard key={game.id} game={game} userWithId={userWithId} />
          ))}
        </Grid>
        {gamesListWaiting.length > 0 && (
          <Typography variant="h4" sx={{ my: 3 }}>
            Väntar på andras drag
          </Typography>
        )}
        <Grid container spacing={2}>
          {gamesListWaiting.map((game) => (
            <GameListCard key={game.id} game={game} userWithId={userWithId} />
          ))}
        </Grid>
        {gamesList.length == 0 && (
          <Typography>Du har inga pågående spel.</Typography>
        )}
      </Container>
    );
  } else {
    return (
      <Container maxWidth="sm" style={{ textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
};
