import React, { useEffect, useState } from 'react';
import { Button, styled } from '@mui/material';

const defaultBoard = [
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '']
];

const startingTiles = ['A', 'R', 'E', 'T', 'S', 'O', 'L'];

export const Board: React.FC<{}> = () => {
  const [board, setBoard] = useState(defaultBoard);
  const [tiles, setTiles] = useState(startingTiles);
  const [unplayedBoard, setUnplayedBoard] = useState(defaultBoard);
  const [selectedTile, setSelectedTile] = useState('');
  useEffect(() => {
    // herp
  }, []);

  const selectTile = (tile: string) => {
    console.log('select tile: ', tile);
    setSelectedTile(tile);
  };

  const placeTile = (placedTile: string, row: number, column: number) => {
    const copiedBoard = unplayedBoard.map((row) => row.map((cell) => cell));
    const copiedTiles = [...tiles];

    if (placedTile !== '') {
      console.log('unplace tile', placedTile);
      copiedTiles.push(placedTile);

      copiedBoard[row][column] = '';
    }
    if (selectedTile !== '') {
      console.log('place tile: ', selectedTile);

      copiedBoard[row][column] = selectedTile;

      const index = copiedTiles.indexOf(selectedTile);
      if (index > -1) {
        copiedTiles.splice(index, 1);
      }
      setSelectedTile('');
    }

    setTiles(copiedTiles);
    setUnplayedBoard(copiedBoard);
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
              {cell}
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
            {tile}
          </Tile>
        ))}
      </TileHolder>
      <Button variant="outlined">Spela ordet</Button>
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
  fontSize: '1rem',

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
  fontSize: '1rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));
