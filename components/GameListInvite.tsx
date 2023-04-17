import React from 'react';
import {
  Avatar,
  AvatarGroup,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  styled
} from '@mui/material';
import { GameWithEverything } from 'types/types';
import { gravatar } from 'services/helpers';
import router from 'next/router';
import { acceptInvite, declineInvite } from 'services/local';
import { useUser } from '@auth0/nextjs-auth0';
import { DateTime } from 'luxon';

export const GameInviteListItem = ({
  game,
  removeGameFromList
}: {
  game: GameWithEverything;
  removeGameFromList: (gameId: number) => void;
}) => {
  const [fade, setFade] = React.useState(false);
  const { user } = useUser();
  if (!user) return null;

  const handleAcceptInvite = () => {
    if (user && user.sub) {
      acceptInvite(game.id, user.sub);

      router.push(`/game/${game.id}`);
    }
  };

  const handleDeclineInvite = () => {
    if (user && user.sub) {
      setFade(true);
      declineInvite(game.id, user.sub);
      setTimeout(() => {
        removeGameFromList(game.id);
      }, 1000);
    }
  };

  let startTimeString = DateTime.fromISO(new Date(game.startedAt).toISOString())
    .setLocale('sv')
    .toRelative({ style: 'long' });

  let starterName =
    game.users.find((user) => user.userSub == game.startedBySub)?.user.name ||
    'Unknown';

  return (
    <FadeWrapper fade={fade} disableGutters>
      <ListItemAvatar sx={{ pr: 1, minWidth: '100px' }}>
        <AvatarGroup max={4} spacing={28}>
          {game.users.map(
            (player, index) =>
              user.sub !== player.userSub && (
                <Avatar
                  sx={{ zIndex: index }}
                  key={index}
                  src={player.user.picture || gravatar(player.user.email)}
                />
              )
          )}
        </AvatarGroup>
      </ListItemAvatar>
      <ListItemText
        primary={starterName + ' har bjudit in dig'}
        secondary={
          <>
            {'Inbjudan skickades ' + startTimeString}
            <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  handleAcceptInvite();
                }}
              >
                Acceptera
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  handleDeclineInvite();
                }}
              >
                Neka
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
