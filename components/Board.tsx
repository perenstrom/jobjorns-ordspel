import React, { useEffect, useState } from 'react';
import { Button, styled } from '@mui/material';

const defaultBoard = [
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ]
];

const startingTiles: Tile[] = [
  { letter: 'S', placed: 'hand' },
  { letter: 'A', placed: 'hand' },
  { letter: 'T', placed: 'hand' },
  { letter: 'O', placed: 'hand' },
  { letter: 'R', placed: 'hand' },
  { letter: 'E', placed: 'hand' },
  { letter: 'P', placed: 'hand' }
];

interface Tile {
  letter: string;
  placed: string;
}

const emptyTile: Tile = {
  letter: '',
  placed: 'no'
};

export const Board: React.FC<{}> = () => {
  const [board, setBoard] = useState(defaultBoard);
  const [tiles, setTiles] = useState(startingTiles);
  const [unplayedBoard, setUnplayedBoard] = useState(defaultBoard);
  const [selectedTile, setSelectedTile] = useState<Tile>(emptyTile);
  useEffect(() => {
    // herp
  }, []);

  const selectTile = (tile: Tile) => {
    console.log('select tile: ', tile.letter);
    setSelectedTile(tile);
  };

  const placeTile = (placedTile: Tile, row: number, column: number) => {
    const copiedBoard = unplayedBoard.map((row) => row.map((cell) => cell));
    const copiedTiles = [...tiles];

    if (placedTile.letter !== emptyTile.letter) {
      console.log('unplace tile', placedTile);
      copiedTiles.push(placedTile);

      copiedBoard[row][column] = emptyTile;
    }
    if (selectedTile.letter !== emptyTile.letter) {
      console.log('place tile: ', selectedTile);

      copiedBoard[row][column] = selectedTile;

      const index = copiedTiles.indexOf(selectedTile);
      if (index > -1) {
        copiedTiles.splice(index, 1);
      }
      setSelectedTile(emptyTile);
    }

    setTiles(copiedTiles);
    setUnplayedBoard(copiedBoard);
  };

  const submitWord = () => {
    console.log('submit word!');
    unplayedBoard.map((row, indexRow) =>
      row.map((cell, indexColumn) => {
        if (cell.letter !== emptyTile.letter) {
          return false;
        }
      })
    );
  };

  return (
    <>
      <BoardGrid>
        {unplayedBoard.map((row, indexRow) =>
          row.map((cell, indexColumn) => (
            <BoardCell
              onClick={() => placeTile(cell, indexRow, indexColumn)}
              key={indexRow * 100 + indexColumn}
            >
              {cell.letter}
            </BoardCell>
          ))
        )}
      </BoardGrid>
      <TileHolder>
        {tiles.map((tile, index) => (
          <Tile
            isSelected={tile === selectedTile}
            key={index}
            onClick={() => selectTile(tile)}
          >
            {tile.letter}
          </Tile>
        ))}
      </TileHolder>
      <Button variant="outlined" onClick={() => submitWord()}>
        Spela ordet
      </Button>
    </>
  );
};

const TileHolder = styled('div')(() => ({
  border: '2px solid teal',
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '0px 0px',
  justifyItems: 'stretch'
}));

interface TileProps {
  readonly isSelected: boolean;
}

const Tile = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<TileProps>(({ isSelected }) => ({
  backgroundColor: isSelected ? 'lime' : 'white',
  border: '1px solid red',
  maxWidth: '100%',
  width: '100%',
  aspectRatio: '1',
  fontSize: '3rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

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

const BoardCell = styled('div')((props) => ({
  border: '1px solid blue',
  maxWidth: '100%',
  width: '100%',
  aspectRatio: '1',
  fontSize: '3rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));
