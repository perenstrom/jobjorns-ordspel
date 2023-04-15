import React from 'react';
import { Button, ListItem, ListItemText, Stack, styled } from '@mui/material';
import { GameWithEverything } from 'types/types';
import { dismissRefusal } from 'services/local';
import { useUser } from '@auth0/nextjs-auth0';
import { DateTime } from 'luxon';

export const GameListRefusal = ({
  game,
  removeGameFromList
}: {
  game: GameWithEverything;
  removeGameFromList: (gameId: number) => void;
}) => {
  const [fade, setFade] = React.useState(false);
  const { user } = useUser();
  if (!user) return null;

  const handleDismissRefusal = () => {
    if (user && user.sub) {
      setFade(true);
      dismissRefusal(game.id, user.sub);
      setTimeout(() => {
        removeGameFromList(game.id);
      }, 1000);
    }
  };

  let startTimeString = DateTime.fromISO(new Date(game.startedAt).toISOString())
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
