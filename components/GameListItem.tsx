import React from 'react';
import {
  Avatar,
  AvatarGroup,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText
} from '@mui/material';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { GameWithEverything } from 'types/types';
import { gravatar } from 'services/helpers';
import { useUser } from '@auth0/nextjs-auth0';

export const GameListListItem = ({ game }: { game: GameWithEverything }) => {
  const { user } = useUser();
  if (!user) return null;

  let latestTurnStartTime: Date;
  let timeSinceText: string;
  if (game.turns[0] && game.finished) {
    latestTurnStartTime = game.turns[0].turnStart;
    timeSinceText = 'Spelet slutade ';
  } else if (game.turns[0]) {
    latestTurnStartTime = game.turns[0].turnStart;
    timeSinceText = 'Turen startade ';
  } else {
    latestTurnStartTime = game.startedAt;
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
};
