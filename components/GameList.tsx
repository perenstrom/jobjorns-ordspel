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
import { GameWithEverything } from 'types/types';
import { GameListListItem } from './GameListItem';
import { GameInviteListItem } from './GameListInvite';
import { GameListRefusal } from './GameListRefusal';
import Head from 'next/head';
import { faviconString } from 'services/helpers';

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
  const [favicon, setFavicon] = useState<string>('');
  const [updatedInvitationsToggle, setUpdatedInvitationsToggle] =
    useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    const fetchGamesList = async () => {
      if (user && user.sub) {
        const newGamesList = await listGames(user.sub);

        if (newGamesList.success) {
          console.log('här får vi nya games!', newGamesList.data);
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

        console.log({ newUpdatedInvitations });
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
        } else if (
          game.startedBySub == user.sub &&
          game.users.length == 1 &&
          game.invitations.length == 0
        ) {
          newGamesListRefusals.push(game);
        } else if (
          game.turns[0] &&
          game.turns[0].moves.findIndex((move) => move.userSub == user.sub) >
            -1 &&
          game.turns[0].turnNumber == game.currentTurn
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
              <title>
                {'(' + gamesListReady.length + ') Jobjörns ordspel'}
              </title>
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
            <ListSubheader style={{ zIndex: 200 }}>
              Väntar på ditt drag
            </ListSubheader>
          )}

          {gamesListReady.map((game, index) => (
            <GameListListItem key={index} game={game} />
          ))}

          {gamesListWaiting.length > 0 && (
            <ListSubheader style={{ zIndex: 200 }}>
              Väntar på andras drag
            </ListSubheader>
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
