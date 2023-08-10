import React, { useEffect, useState } from 'react';
import {
  Button,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  styled
} from '@mui/material';
import { GameWithEverything } from 'types/types';
import { dismissRefusal, getGame } from 'services/local';
import { useUser } from '@auth0/nextjs-auth0/client';
import { DateTime } from 'luxon';

export const GameListRefusal = ({
  gameId,
  removeGameFromList
}: {
  gameId: number;
  removeGameFromList: (gameId: number) => void;
}) => {
  const [fade, setFade] = React.useState(false);
  const [game, setGame] = useState<GameWithEverything>();

  const fetchGame = async (gameId: number) => {
    if (gameId > 0) {
      const newGame = await getGame(gameId);

      if (newGame.success && newGame.data) {
        setGame(newGame.data);
      }
    }
  };

  useEffect(() => {
    fetchGame(gameId);
  }, [gameId]);

  const { user } = useUser();
  if (!user) return null;

  const handleDismissRefusal = () => {
    if (user && user.sub) {
      setFade(true);
      dismissRefusal(gameId, user.sub);
      setTimeout(() => {
        removeGameFromList(gameId);
      }, 1000);
    }
  };

  if (game) {
    let startTimeString = DateTime.fromISO(
      new Date(game.startedAt).toISOString()
    )
      .setLocale('sv')
      .toRelative({ style: 'long' });

    return (
      <FadeWrapper fade={fade} disableGutters>
        <ListItemText
          primary={'Alla inbjudna spelare tackade nej'}
          secondary={
            <>
              {'Inbjudan skickades ' + startTimeString}
              <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleDismissRefusal();
                  }}
                >
                  Avvisa
                </Button>
              </Stack>
            </>
          }
        />
      </FadeWrapper>
    );
  } else {
    return (
      <FadeWrapper fade={fade} disableGutters>
        <ListItemText
          primary={'Alla inbjudna spelare tackade nej'}
          secondary={
            <>
              {'Inbjudan skickades ' + <Skeleton variant="text" width={100} />}
              <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleDismissRefusal();
                  }}
                >
                  Avvisa
                </Button>
              </Stack>
            </>
          }
        />
      </FadeWrapper>
    );
  }
};

type FadeWrapperProps = {
  fade: boolean;
};

const FadeWrapper = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'fade'
})<FadeWrapperProps>((props) => ({
  opacity: props.fade ? 0 : 1,
  transition: 'opacity 1s ease-in-out'
}));
