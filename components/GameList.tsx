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
import { getUpdatedInvitations, listGames } from 'services/local';
import { GameListNecessaryData } from 'types/types';
import { GameListListItem } from './GameListItem';
import { GameInviteListItem } from './GameListInvite';
import { GameListRefusal } from './GameListRefusal';
import Head from 'next/head';
import { faviconString } from 'services/helpers';

export const GameList: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  // const [userWithId, setUserWithId] = useState<User>();
  const [gamesList, setGamesList] = useState<GameListNecessaryData[]>([]);
  const [gamesListInvites, setGamesListInvites] = useState<
    GameListNecessaryData[]
  >([]);
  const [gamesListRefusals, setGamesListRefusals] = useState<
    GameListNecessaryData[]
  >([]);
  const [gamesListWaiting, setGamesListWaiting] = useState<
    GameListNecessaryData[]
  >([]);
  const [gamesListReady, setGamesListReady] = useState<GameListNecessaryData[]>(
    []
  );
  const [gamesListFinished, setGamesListFinished] = useState<
    GameListNecessaryData[]
  >([]);
  const [favicon, setFavicon] = useState<string>('');
  const [updatedInvitationsToggle, setUpdatedInvitationsToggle] =
    useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    const fetchGamesList = async () => {
      if (user && user.sub) {
        const newGamesList = await listGames(user.sub);

        if (newGamesList.success) {
          setGamesList(newGamesList.data);
        }
      }
      setLoading(false);
    };

    fetchGamesList();
  }, [user, updatedInvitationsToggle]);

  useEffect(() => {
    const fetchUpdatedInvitations = async () => {
      if (user && user.email && user.sub) {
        const newUpdatedInvitations = await getUpdatedInvitations(
          user.email,
          user.sub
        );

        if (
          newUpdatedInvitations.success &&
          newUpdatedInvitations.data &&
          newUpdatedInvitations.data.length > 0
        ) {
          setUpdatedInvitationsToggle(true);
        }
      }
    };

    fetchUpdatedInvitations();
  }, [user]);

  useEffect(() => {
    if (user && user.sub && gamesList.length > 0) {
      let newGamesListInvites: GameListNecessaryData[] = [];
      let newGamesListRefusals: GameListNecessaryData[] = [];
      let newGamesListReady: GameListNecessaryData[] = [];
      let newGamesListWaiting: GameListNecessaryData[] = [];
      let newGamesListFinished: GameListNecessaryData[] = [];

      gamesList.map((game) => {
        if (game.status == 'FINISHED') {
          newGamesListFinished.push(game);
        } else if (game.status == 'INVITED') {
          newGamesListInvites.push(game);
        } else if (game.status == 'REFUSED') {
          newGamesListRefusals.push(game);
        } else if (game.status == 'OTHERTURN') {
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

  useEffect(() => {
    const newFavicon = faviconString(gamesListReady.length);

    setFavicon(newFavicon);
  }, [gamesListReady]);

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
        {favicon && (
          <Head>
            <link rel="icon" href={favicon} key="favicon" />
            {gamesListReady.length > 0 && (
              <title>{'(' + gamesListReady.length + ') Ordbjörn'}</title>
            )}
          </Head>
        )}
        {gamesListInvites.length > 0 && (
          <Typography variant="h4" sx={{}}>
            Inbjudningar
          </Typography>
        )}
        <List>
          {gamesListInvites.map((game, index) => (
            <GameInviteListItem
              key={index}
              gameId={game.id}
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
              gameId={game.id}
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
            <ListSubheader style={{ zIndex: 200 }}>
              Väntar på ditt drag
            </ListSubheader>
          )}

          {gamesListReady.map((game, index) => (
            <GameListListItem key={index} gameId={game.id} />
          ))}

          {gamesListWaiting.length > 0 && (
            <ListSubheader style={{ zIndex: 200 }}>
              Väntar på andras drag
            </ListSubheader>
          )}
          {gamesListWaiting.map((game, index) => (
            <GameListListItem key={index} gameId={game.id} />
          ))}
        </List>

        {gamesListFinished.length > 0 && (
          <Typography variant="h4" sx={{}}>
            Avslutade spel
          </Typography>
        )}
        <List>
          {gamesListFinished.map((game, index) => (
            <GameListListItem key={index} gameId={game.id} />
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
