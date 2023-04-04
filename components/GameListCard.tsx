import React from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography
} from '@mui/material';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { GameWithEverything } from 'types/types';
import { User } from '@prisma/client';
import { gravatar } from 'services/helpers';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AbcIcon from '@mui/icons-material/Abc';
import { grey } from '@mui/material/colors';

export const GameListCard = ({
  game,
  userWithId
}: {
  game: GameWithEverything;
  userWithId: User;
}) => {
  /*
saker som borde vara med i denna vyn:

1) har du spelat eller inte?
2) vilka deltagare har spelat?
3) vilka har inte spelat?
4) vilket var det senaste vinnande ordet
5) hur länge sedan lades det
6) vilken tur är det

*/

  let hasPlayed: boolean;
  if (game.turns[0]) {
    hasPlayed =
      game.turns[0].moves.findIndex((move) => move.userId == userWithId.id) >
      -1;
  } else {
    hasPlayed = false;
  }
  console.log({ hasPlayed });

  let usersWhoPlayed: number[] = [];
  if (game.turns[0]) {
    usersWhoPlayed = game.turns[0]?.moves.map((move) => move.userId);
  }
  console.log({ usersWhoPlayed });

  let usersWhoPlayedNot: number[] = [];
  game.users.map((user) => {
    if (!usersWhoPlayed.includes(user.userId)) {
      usersWhoPlayedNot.push(user.userId);
    }
  });
  console.log({ usersWhoPlayedNot });

  let latestWinningWord: string = '';
  let newLatestWinningWord = game.turns[1]?.moves.find(
    (move) => move.won == true
  )?.playedWord;
  if (newLatestWinningWord) {
    latestWinningWord = newLatestWinningWord;
  }
  console.log({ latestWinningWord });

  let latestTurnStartTime: Date;
  if (game.turns[0]) {
    latestTurnStartTime = game.turns[0].turnStart;
  } else {
    latestTurnStartTime = game.startedAt;
  }
  console.log({ latestTurnStartTime });

  let currentTurn = game.currentTurn;
  console.log({ currentTurn });

  return (
    <Grid
      item
      sm={12}
      md={6}
      key={game.id}
      style={{ width: '100%', height: '100%' }}
    >
      <Link key={game.id} passHref href={`/game/${game.id}`}>
        <CardActionArea>
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
                  paddingRight: '1rem',
                  alignItems: 'center'
                }}
              >
                <HourglassEmptyIcon
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
                    {usersWhoPlayedNot.map((userId) => (
                      <Avatar
                        key={userId}
                        src={gravatar(
                          game.users.find((user) => user.userId == userId)?.user
                            .email
                        )}
                      />
                    ))}
                  </AvatarGroup>
                </div>
              </Box>

              <Box
                sx={{
                  flexBasis: '50%',
                  flexGrow: 0,
                  maxWidth: '50%',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  boxModel: 'content-box',
                  paddingLeft: '1rem',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <AbcIcon style={{ marginRight: '1rem' }} />
                {latestWinningWord.length > 0 ? (
                  <Typography
                    style={{
                      display: 'inline-block'
                    }}
                  >
                    {latestWinningWord}
                  </Typography>
                ) : (
                  <Typography color={grey[500]}>
                    {'(inget ord lagt)'}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  flexBasis: '50%',
                  flexGrow: 0,
                  maxWidth: '50%',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  boxModel: 'content-box',
                  paddingRight: '1rem'
                }}
              >
                <DoneIcon style={{ marginRight: '1rem' }} />
                <div
                  style={{
                    display: 'inline-block'
                  }}
                >
                  <AvatarGroup max={4} style={{ flexDirection: 'row-reverse' }}>
                    {usersWhoPlayed.map((userId) => (
                      <Avatar
                        key={userId}
                        src={gravatar(
                          game.users.find((user) => user.userId == userId)?.user
                            .email
                        )}
                      />
                    ))}
                  </AvatarGroup>
                  {usersWhoPlayed.length < 1 && (
                    <Typography color={grey[500]}>
                      {'(inga drag gjorda)'}
                    </Typography>
                  )}
                </div>
              </Box>
              <Box
                sx={{
                  flexBasis: '50%',
                  flexGrow: 0,
                  maxWidth: '50%',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  boxModel: 'content-box',
                  paddingLeft: '1rem',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <AccessTimeIcon style={{ marginRight: '1rem' }} />
                <Typography
                  style={{
                    display: 'inline-block'
                  }}
                >
                  {DateTime.fromISO(new Date(latestTurnStartTime).toISOString())
                    .setLocale('sv')
                    .toRelative({ style: 'long' })
                    ?.replace('för ', '')
                    .replace(' sedan', '')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </CardActionArea>
      </Link>
    </Grid>
  );
};
