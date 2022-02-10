import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Input, Paper, styled } from '@mui/material';

const defaultBoard = [
  ['-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-']
];

export const Board: React.FC<{}> = () => {
  const [board, setBoard] = useState(defaultBoard);
  useEffect(() => {
    // herp
  }, []);

  const onBoardEntry = (letter: string, row: number, column: number) => {
    const copiedBoard = board.map((row) => row.map((cell) => cell));
    copiedBoard[row][column] = letter;
    setBoard(copiedBoard);
  };

  return (
    <>
      <BoardGrid>
        {board.map((row, indexRow) =>
          row.map((cell, indexColumn) => (
            <BoardCell
              key={indexRow * 100 + indexColumn}
              defaultValue={cell}
              onChange={(event) =>
                onBoardEntry(event.target.value, indexRow, indexColumn)
              }
            />
          ))
        )}
      </BoardGrid>
      <Button variant="outlined">Spela ordet</Button>
    </>
  );
};

const BoardGrid = styled('div')(() => ({
  border: '2px solid green',
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gridTemplateRows: 'repeat(7, 1fr)',
  gap: '0px 0px',
  justifyItems: 'stretch'
}));

const BoardCellContainer = styled('div')(() => ({
  border: '2px solid red'
}));

const BoardCell = styled('input')((props) => ({
  border: '1px solid blue',
  maxWidth: '100%',
  width: '100%'
}));
