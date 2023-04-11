import React, { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography
} from '@mui/material';
import { User } from '@prisma/client';
import { useUser } from '@auth0/nextjs-auth0';
import { getUser, listGames } from 'services/local';
import { GameWithEverything } from 'types/types';
import { GameListCard } from './GameListCard';
import { GameInviteCard } from './GameInviteCard';

export const GameList: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [userWithId, setUserWithId] = useState<User>();
  const [gamesList, setGamesList] = useState<GameWithEverything[]>([]);
  const [gamesListInvites, setGamesListInvites] = useState<
    GameWithEverything[]
  >([]);
  const [gamesListWaiting, setGamesListWaiting] = useState<
    GameWithEverything[]
  >([]);
  const [gamesListReady, setGamesListReady] = useState<GameWithEverything[]>(
    []
  );

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
      if (user && user.sub) {
        const newGamesList = await listGames(user.sub);
        let newGamesListInvites: GameWithEverything[] = [];
        let newGamesListWaiting: GameWithEverything[] = [];
        let newGamesListReady: GameWithEverything[] = [];

        if (newGamesList.success) {
          newGamesList.data.map((game) => {
            if (
              game.users.find((gameUser) => gameUser.userSub == user.sub)
                ?.userAccepted == false
            ) {
              newGamesListInvites.push(game);
            } else if (
              game.turns[0] &&
              game.turns[0].moves.findIndex(
                (move) => move.userSub == user.sub
              ) > -1
            ) {
              newGamesListWaiting.push(game);
            } else {
              newGamesListReady.push(game);
            }
          });

          setGamesListInvites(newGamesListInvites);
          setGamesListWaiting(newGamesListWaiting);
          setGamesListReady(newGamesListReady);
          setGamesList(newGamesList.data);
        }
      }
      setLoading(false);
    };

    fetchGamesList();
  }, [user]);

  if (gamesList.length == 0 && !loading) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ my: 3 }}>
          Du har inga spel än. Skapa ett nytt spel nedan!
        </Typography>
        <Button variant="contained" href="/game/new">
          Skapa nytt spel
        </Button>
      </Container>
    );
  } else if (gamesList && !loading && userWithId) {
    return (
      <Container maxWidth="md">
        {gamesListInvites.length > 0 && (
          <Typography variant="h4" sx={{ my: 3 }}>
            Inbjudningar
          </Typography>
        )}
        <Grid container spacing={2}>
          {gamesListInvites.map((game, index) => (
            <GameInviteCard key={index} game={game} userWithId={userWithId} />
          ))}
        </Grid>
        {gamesListReady.length > 0 && (
          <Typography variant="h4" sx={{ my: 3 }}>
            Väntar på ditt drag
          </Typography>
        )}
        <Grid container spacing={2}>
          {gamesListReady.map((game, index) => (
            <GameListCard key={index} game={game} userWithId={userWithId} />
          ))}
        </Grid>
        {gamesListWaiting.length > 0 && (
          <Typography variant="h4" sx={{ my: 3 }}>
            Väntar på andras drag
          </Typography>
        )}
        <Grid container spacing={2}>
          {gamesListWaiting.map((game, index) => (
            <GameListCard key={index} game={game} userWithId={userWithId} />
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
