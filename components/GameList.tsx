import React, { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  List,
  ListSubheader,
  Typography
} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0';
import { listGames } from 'services/local';
import { GameWithEverything } from 'types/types';
import { GameListListItem } from './GameListItem';
import { GameInviteListItem } from './GameListInvite';
import { GameListRefusal } from './GameListRefusal';

export const GameList: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  // const [userWithId, setUserWithId] = useState<User>();
  const [gamesList, setGamesList] = useState<GameWithEverything[]>([]);
  const [gamesListInvites, setGamesListInvites] = useState<
    GameWithEverything[]
  >([]);
  const [gamesListRefusals, setGamesListRefusals] = useState<
    GameWithEverything[]
  >([]);
  const [gamesListWaiting, setGamesListWaiting] = useState<
    GameWithEverything[]
  >([]);
  const [gamesListReady, setGamesListReady] = useState<GameWithEverything[]>(
    []
  );
  const [gamesListFinished, setGamesListFinished] = useState<
    GameWithEverything[]
  >([]);

  const { user } = useUser();

  /*
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
  */

  useEffect(() => {
    const fetchGamesList = async () => {
      if (user && user.sub) {
        const newGamesList = await listGames(user.sub);

        if (newGamesList.success) {
          console.log(newGamesList.data);
          setGamesList(newGamesList.data);
        }
      }
      setLoading(false);
    };

    fetchGamesList();
  }, [user]);

  useEffect(() => {
    if (user && user.sub && gamesList.length > 0) {
      let newGamesListInvites: GameWithEverything[] = [];
      let newGamesListRefusals: GameWithEverything[] = [];
      let newGamesListReady: GameWithEverything[] = [];
      let newGamesListWaiting: GameWithEverything[] = [];
      let newGamesListFinished: GameWithEverything[] = [];

      gamesList.map((game) => {
        console.log({ 'game.id': game.id, 'game.finished': game.finished });
        if (game.finished) {
          newGamesListFinished.push(game);
        } else if (
          game.users.find((player) => player.userSub == user.sub)
            ?.userAccepted == false
        ) {
          newGamesListInvites.push(game);
        } else if (game.startedBySub == user.sub && game.users.length == 1) {
          newGamesListRefusals.push(game);
        } else if (
          game.turns[0] &&
          game.turns[0].moves.findIndex((move) => move.userSub == user.sub) > -1
        ) {
          newGamesListWaiting.push(game);
        } else {
          newGamesListReady.push(game);
        }
      });

      setGamesListInvites(newGamesListInvites);
      setGamesListRefusals(newGamesListRefusals);
      setGamesListWaiting(newGamesListWaiting);
      setGamesListReady(newGamesListReady);
      setGamesListFinished(newGamesListFinished);
    }
  }, [user, gamesList]);

  const removeGameFromList = (gameId: number) => {
    const newGamesList = gamesList.filter((game) => game.id != gameId);
    setGamesList(newGamesList);
  };

  if (gamesList.length == 0 && !loading) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ my: 3 }}>
          Du har inga spel än. Skapa ett nytt spel nedan!
        </Typography>
        <Button variant="contained" href="/game/new">
          Skapa nytt spel
        </Button>
      </Container>
    );
  } else if (gamesList && !loading && user) {
    return (
      <Container maxWidth="sm" sx={{ flexGrow: 1 }}>
        {gamesListInvites.length > 0 && (
          <Typography variant="h4" sx={{}}>
            Inbjudningar
          </Typography>
        )}
        <List>
          {gamesListInvites.map((game, index) => (
            <GameInviteListItem
              key={index}
              game={game}
              removeGameFromList={removeGameFromList}
            />
          ))}
        </List>

        {gamesListRefusals.length > 0 && (
          <Typography variant="h4" sx={{}}>
            Avvisade inbjudningar
          </Typography>
        )}
        <List>
          {gamesListRefusals.map((game, index) => (
            <GameListRefusal
              key={index}
              game={game}
              removeGameFromList={removeGameFromList}
            />
          ))}
        </List>

        {(gamesListReady.length > 0 || gamesListWaiting.length > 0) && (
          <Typography variant="h4" sx={{}}>
            Pågående spel
          </Typography>
        )}
        <List>
          {gamesListReady.length > 0 && (
            <ListSubheader>Väntar på ditt drag</ListSubheader>
          )}

          {gamesListReady.map((game, index) => (
            <GameListListItem key={index} game={game} />
          ))}

          {gamesListWaiting.length > 0 && (
            <ListSubheader>Väntar på andras drag</ListSubheader>
          )}
          {gamesListWaiting.map((game, index) => (
            <GameListListItem key={index} game={game} />
          ))}
        </List>

        {gamesListFinished.length > 0 && (
          <Typography variant="h4" sx={{}}>
            Avslutade spel
          </Typography>
        )}
        <List>
          {gamesListFinished.map((game, index) => (
            <GameListListItem key={index} game={game} />
          ))}
        </List>
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
