import React from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  styled
} from '@mui/material';
import { GameWithEverything } from 'types/types';
import { User } from '@prisma/client';
import { gravatar } from 'services/helpers';
import PeopleIcon from '@mui/icons-material/People';
import StartIcon from '@mui/icons-material/Start';
import router from 'next/router';
import { acceptInvite, declineInvite } from 'services/local';

export const GameInviteCard = ({
  game,
  userWithId
}: {
  game: GameWithEverything;
  userWithId: User;
}) => {
  const [fade, setFade] = React.useState(false);

  const handleAcceptInvite = () => {
    acceptInvite(game.id, userWithId.id);

    router.push(`/game/${game.id}`);
  };

  const handleDeclineInvite = () => {
    console.log('decline invite');
    declineInvite(game.id, userWithId.id);

    setFade(true);
  };

  return (
    <FadeWrapper
      fade={fade}
      item
      sm={12}
      md={6}
      style={{ width: '100%', height: '100%' }}
    >
      <Card variant="outlined">
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0.5rem',
            marginBottom: 'calc(-24px + 0.5rem)'
          }}
        >
          <Box
            sx={{
              flexBasis: '50%',
              flexGrow: 0,
              maxWidth: '50%',
              minHeight: '50px',
              display: 'flex',
              boxModel: 'content-box',
              alignItems: 'center'
            }}
          >
            <StartIcon
              style={{
                marginRight: '1rem'
              }}
            />
            <div
              style={{
                display: 'inline-block'
              }}
            >
              <Avatar
                src={gravatar(
                  game.users.find((user) => user.userSub == game.startedBySub)
                    ?.user.email
                )}
              />
            </div>
          </Box>

          <Box
            sx={{
              flexBasis: '50%',
              flexGrow: 0,
              maxWidth: '50%',
              minHeight: '50px',
              display: 'flex',
              boxModel: 'content-box',
              alignItems: 'center'
            }}
          >
            <PeopleIcon
              style={{
                marginRight: '1rem'
              }}
            />
            <div
              style={{
                display: 'inline-block'
              }}
            >
              <AvatarGroup
                max={4}
                style={{ flexDirection: 'row-reverse' }}
                spacing="small"
              >
                {game.users.map(
                  (user, index) =>
                    user.userSub != game.startedBySub && (
                      <Avatar key={index} src={gravatar(user.user.email)} />
                    )
                )}
              </AvatarGroup>
            </div>
          </Box>

          <Box
            sx={{
              flexBasis: '100%',
              flexGrow: 0,
              maxWidth: '100%',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              boxModel: 'content-box'
            }}
          >
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={() => {
                  handleAcceptInvite();
                }}
              >
                Acceptera
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  handleDeclineInvite();
                }}
              >
                Neka
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </FadeWrapper>
  );
};

type FadeWrapperProps = {
  fade: boolean;
};

const FadeWrapper = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'fade'
})<FadeWrapperProps>((props) => ({
  opacity: props.fade ? 0 : 1,
  transform: props.fade ? 'translateY(-1000%)' : 'translateX(0)',
  overflow: 'hidden',
  transition: 'opacity 1s ease-in-out, transform 0s 1s'
}));
