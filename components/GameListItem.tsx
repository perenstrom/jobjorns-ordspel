import React, { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton
} from '@mui/material';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { GameWithEverything } from 'types/types';
import { gravatar } from 'services/helpers';
import { useUser } from '@auth0/nextjs-auth0';
import { getGame } from 'services/local';

export const GameListListItem = ({ gameId }: { gameId: number }) => {
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

  if (game) {
    let timeSinceText: string;

    let latestTurnStartTime = game.users.find(
      (player) => player.userSub == user.sub
    )?.statusTime;
    if (!latestTurnStartTime) {
      latestTurnStartTime = game.startedAt;
    }

    if (game.finished) {
      timeSinceText = 'Spelet slutade ';
    } else if (game.turns[0]) {
      timeSinceText = 'Turen startade ';
    } else {
      timeSinceText = 'Spelet startade ';
    }

    let timeSinceLastMove = DateTime.fromISO(
      new Date(latestTurnStartTime).toISOString()
    )
      .setLocale('sv')
      .toRelative({ style: 'long' });

    let playersList = '';
    game.users.forEach((player) => {
      if (player.userSub !== user.sub) {
        if (playersList.length == 0) {
          playersList = player.user.name;
        } else {
          playersList += ', ' + player.user.name;
        }
      }
    });

    game.invitations.forEach((invitation) => {
      if (playersList.length == 0) {
        playersList = invitation.email;
      } else {
        playersList += ', ' + invitation.email;
      }
    });

    return (
      <ListItem disableGutters>
        <Link passHref href={`/game/${game.id}`}>
          <ListItemButton component="a" sx={{ p: 1, m: -1 }}>
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
                {game.invitations.map((invitation, index) => (
                  <Avatar
                    sx={{ zIndex: 100 + index }}
                    key={100 + index}
                    src={gravatar(invitation.email)}
                  />
                ))}
              </AvatarGroup>
            </ListItemAvatar>
            <ListItemText
              sx={{
                '& .MuiListItemText-primary': {
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }
              }}
              primary={playersList}
              secondary={timeSinceText + timeSinceLastMove}
            />
          </ListItemButton>
        </Link>
      </ListItem>
    );
  } else {
    return (
      <ListItem disableGutters>
        <Link passHref href={`/game/${gameId}`}>
          <ListItemButton component="a" sx={{ p: 1, m: -1 }}>
            <ListItemAvatar sx={{ pr: 1, minWidth: '100px' }}>
              <AvatarGroup max={4} spacing={28}>
                <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
              </AvatarGroup>
            </ListItemAvatar>
            <ListItemText
              sx={{
                '& .MuiListItemText-primary': {
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }
              }}
              primary={<Skeleton variant="text" />}
              secondary={<Skeleton variant="text" />}
            />
          </ListItemButton>
        </Link>
      </ListItem>
    );
  }
};
