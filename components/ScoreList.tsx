import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Move, Turn } from '@prisma/client';
import { GameWithEverything } from 'types/types';
import { amber, blue } from '@mui/material/colors';
import { useEffect, useState } from 'react';

interface ScoreListProps {
  game: GameWithEverything;
}

export const ScoreList = ({ game }: ScoreListProps) => {
  const [userPoints, setUserPoints] = useState<
    { userId: number; points: number }[]
  >([]);

  useEffect(() => {
    let newUserPoints: { userId: number; points: number }[] = [];

    game.users.map((user) => {
      let points = calculateUserPoints(
        user.userId,
        game.turns,
        game.currentTurn
      );
      newUserPoints.push({ userId: user.userId, points: points });
    });

    setUserPoints(newUserPoints);
  }, [game]);

  return (
    <>
      <TableContainer sx={{ mt: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              {game.users.map((user) => (
                <TableCell key={user.userId} style={{ fontWeight: 'bold' }}>
                  {user.user.name}
                  <SingleScorePoints
                    points={
                      userPoints.find((x) => x.userId == user.userId)?.points
                    }
                    won={
                      Math.max(...userPoints.map((x) => x.points)) ==
                      userPoints.find((x) => x.userId == user.userId)?.points
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
            {game.turns.map(
              (turn) =>
                turn.turnNumber !== game.currentTurn && (
                  <TableRow key={turn.id}>
                    <TableCell>{turn.turnNumber}</TableCell>
                    {game.users.map((user) => (
                      <SingleScore
                        key={user.userId}
                        move={turn.moves.find(
                          (move) => move.userId == user.userId
                        )}
                      />
                    ))}
                  </TableRow>
                )
            )}
          </TableHead>
        </Table>
      </TableContainer>
    </>
  );
};

interface SingleScoreProps {
  move?: Move;
}

export const SingleScore = ({ move }: SingleScoreProps) => {
  if (move) {
    return (
      <TableCell>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            flexDirection: 'row'
          }}
        >
          {move.playedWord}
          <SingleScorePoints points={move.playedPoints} won={move.won} />
        </div>
      </TableCell>
    );
  } else {
    return <TableCell></TableCell>;
  }
};

export const SingleScorePoints = ({
  points,
  won
}: {
  points?: number;
  won: boolean;
}) => {
  if (typeof points === 'undefined') {
    points = 0;
  }
  let pointsColor;
  let textColor;
  if (won) {
    pointsColor = amber[500];
    textColor = 'black';
  } else {
    pointsColor = blue[500];
    textColor = 'white';
  }
  return (
    <>
      &nbsp;
      <span
        style={{
          backgroundColor: pointsColor,
          color: textColor,
          fontSize: '0.85em',
          padding: '4px',
          borderRadius: '8px',
          lineHeight: 0.8
        }}
      >
        {points}
      </span>
    </>
  );
};

export const calculateUserPoints = (
  userId: number,
  turns: (Turn & {
    moves: Move[];
  })[],
  currentTurn: number
) => {
  let points = 0;
  turns.map((turn) =>
    turn.moves.map((move) => {
      if (move.userId == userId && turn.turnNumber !== currentTurn) {
        points += move.playedPoints;
      }
    })
  );

  return points;
};
