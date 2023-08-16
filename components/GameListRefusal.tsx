import React from 'react';
import {
  Button,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
  styled
} from '@mui/material';
import { GameListData } from 'types/types';
import { dismissRefusal } from 'services/local';
import { useUser } from '@auth0/nextjs-auth0/client';
import { DateTime } from 'luxon';

export const GameListRefusal = ({
  game,
  removeGameFromList
}: {
  game: GameListData['game'];
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
      }, 1100);
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
          disableTypography
          primary={<Typography>Alla inbjudna spelare tackade nej</Typography>}
          secondary={
            <>
              <Typography variant="body2" color="text.secondary">
                {'Inbjudan skickades ' + startTimeString}
              </Typography>
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
          disableTypography
          primary={<Typography>Alla inbjudna spelare tackade nej</Typography>}
          secondary={
            <>
              <Typography variant="body2" color="text.secondary">
                {'Inbjudan skickades ' +
                <Skeleton variant="text" width={100} />}
              </Typography>
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
