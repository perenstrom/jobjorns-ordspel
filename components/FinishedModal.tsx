import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { gravatar } from 'services/helpers';
import { GameWithEverything } from 'types/types';
import ReactConfetti from 'react-confetti';

interface FinishedModalProps {
  game: GameWithEverything;
  userPoints: { userSub: string; points: number }[];
  handleCloseFinishedModal: () => void;
}

export const FinishedModal = ({
  game,
  userPoints,
  handleCloseFinishedModal
}: FinishedModalProps) => {
  const [sortedUsers, setSortedUsers] = useState<GameWithEverything['users']>(
    []
  );
  const [tileCount, setTileCount] = useState(0);

  useEffect(() => {
    let newSortedUsers = game.users;
    newSortedUsers.sort((a, b) => {
      let aPoints =
        userPoints.find((user) => user.userSub === a.userSub)?.points || 0;
      let bPoints =
        userPoints.find((user) => user.userSub === b.userSub)?.points || 0;
      return bPoints - aPoints;
    });
    setSortedUsers(newSortedUsers);
  }, [game.users, userPoints]);

  useEffect(() => {
    let newTileCount = 104 - game.letters.replaceAll(',', '').length;
    setTileCount(newTileCount);
  }, [game.letters]);

  const medalEmojis = ['🥇', '🥈', '🥉'];

  return (
    <Paper
      sx={{
        p: 3,
        m: 3,
        width: '100%',
        maxWidth: '400px'
      }}
      variant="outlined"
    >
      <ReactConfetti recycle={false} />
      <Typography variant="h4">Spelet är slut!</Typography>
      <Typography variant="body1">{tileCount} brickor lagda</Typography>
      <Typography variant="body1">{game.turns.length} turer spelade</Typography>
      <List>
        {sortedUsers.map((user, index) => (
          <ListItem
            key={index}
            secondaryAction={medalEmojis[index] || ''}
            disableGutters
          >
            <ListItemAvatar>
              <Avatar src={user.user.picture || gravatar(user.user.email)} />
            </ListItemAvatar>

            <ListItemText
              primary={user.user.name}
              secondary={
                userPoints.find(
                  (pointsUser) => pointsUser.userSub === user.userSub
                )?.points + ' poäng'
              }
            />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        onClick={() => {
          handleCloseFinishedModal();
        }}
      >
        Okej
      </Button>
    </Paper>
  );
};
