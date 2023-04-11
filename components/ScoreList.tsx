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
    { userSub: string; points: number }[]
  >([]);

  useEffect(() => {
    let newUserPoints: { userSub: string; points: number }[] = [];

    game.users.map((user) => {
      let points = calculateUserPoints(
        user.userSub,
        game.turns,
        game.currentTurn
      );
      newUserPoints.push({ userSub: user.userSub, points: points });
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
                <TableCell key={user.userSub} style={{ fontWeight: 'bold' }}>
                  {user.user.name}
                  <SingleScorePoints
                    points={
                      userPoints.find((x) => x.userSub == user.userSub)?.points
                    }
                    won={
                      Math.max(...userPoints.map((x) => x.points)) ==
                      userPoints.find((x) => x.userSub == user.userSub)?.points
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
                        key={user.userSub}
                        move={turn.moves.find(
                          (move) => move.userSub == user.userSub
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
  if (move && move.playedWord) {
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
  } else if (move && !move.playedWord) {
    return (
      <TableCell>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            flexDirection: 'row',
            color: 'grey'
          }}
        >
          (pass)
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
  userSub: string,
  turns: (Turn & {
    moves: Move[];
  })[],
  currentTurn: number
) => {
  let points = 0;
  turns.map((turn) =>
    turn.moves.map((move) => {
      if (move.userSub == userSub && turn.turnNumber !== currentTurn) {
        points += move.playedPoints;
      }
    })
  );

  return points;
};
