import React, { useEffect, useState } from 'react';
import { Button, styled } from '@mui/material';
import wordList from 'data/swedish.json';
import { defaultBoard } from 'data/defaults';
import { Tile } from 'types/types';
import { allTiles } from 'data/defaults';

const startingTiles: Tile[] = [
  { letter: 'S', placed: 'hand' },
  { letter: 'A', placed: 'hand' },
  { letter: 'T', placed: 'hand' },
  { letter: 'O', placed: 'hand' },
  { letter: 'R', placed: 'hand' },
  { letter: 'E', placed: 'hand' },
  { letter: 'P', placed: 'hand' }
];

const shuffleTilesPile = () => {
  let copiedAllTiles = allTiles.sort((a, b) => 0.5 - Math.random());

  // implementera Fisher Yates istället???
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  return copiedAllTiles;
};

const emptyTile: Tile = {
  letter: '',
  placed: 'no'
};

export const Board: React.FC<{}> = () => {
  const [board, setBoard] = useState(defaultBoard);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [unusedTiles, setUnusedTiles] = useState<Tile[]>(shuffleTilesPile());
  const [unplayedBoard, setUnplayedBoard] = useState(board);
  const [selectedTile, setSelectedTile] = useState<Tile>(emptyTile);
  useEffect(() => {
    // dra de första 7 brickorna från unusedTiles
    let copiedTiles = tiles;
    for (let i = copiedTiles.length; i < 7; i++) {
      copiedTiles.push(unusedTiles.pop());
    }
    setTiles(copiedTiles);
  }, []);

  const selectTile = (tile: Tile) => {
    console.log('select tile: ', tile.letter);
    setSelectedTile(tile);
  };

  const placeTile = (placedTile: Tile, row: number, column: number) => {
    const copiedBoard = unplayedBoard.map((row) => row.map((cell) => cell));
    const copiedTiles = [...tiles];
    if (placedTile.placed === 'board') {
      console.log('this tile is played and can not be removed');
    } else if (placedTile.letter !== emptyTile.letter) {
      console.log('unplace tile', placedTile);
      copiedTiles.push(placedTile);

      copiedBoard[row][column] = emptyTile;
      setSelectedTile(placedTile);
    } else if (selectedTile.letter !== emptyTile.letter) {
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
    let usedColumn = -1;
    let usedRow = -1;
    let correctlyPlaced = [];
    let direction = '';
    let result = true;

    //console.log('submit word!');
    unplayedBoard.map((row, indexRow) =>
      row.map((cell, indexColumn) => {
        if (cell.letter !== emptyTile.letter) {
          // första brickan - alltid OK
          if (usedColumn === -1 && usedRow === -1) {
            //console.log('första brickan:', indexRow, indexColumn, cell.letter);
            usedColumn = indexColumn;
            usedRow = indexRow;
            correctlyPlaced.push(cell.letter);
          } // andra brickan - OK om den är bredvid
          else if (correctlyPlaced.length === 1) {
            //console.log('andra brickan:', indexRow, indexColumn, cell.letter);

            if (
              (usedColumn === indexColumn || usedRow === indexRow) &&
              (usedColumn + 1 === indexColumn || usedRow + 1 === indexRow)
            ) {
              //console.log('andra brickan ligger bredvid!');
              if (usedColumn === indexColumn) {
                direction = 'column';
              } else if (usedRow === indexRow) {
                direction = 'row';
              }
              usedColumn = indexColumn;
              usedRow = indexRow;

              correctlyPlaced.push(cell.letter);
            } else {
              console.log('andra brickan var felaktig');
              result = false;
            }
          } // tredje osv brickan - OK om den är bredvid OCH även på samma rad/kolumn som den första
          else if (correctlyPlaced.length > 1) {
            //console.log('tredje+ brickan:', indexRow, indexColumn, cell.letter);
            if (
              ((direction === 'column' && usedColumn === indexColumn) ||
                (direction === 'row' && usedRow === indexRow)) &&
              (usedColumn + 1 === indexColumn || usedRow + 1 === indexRow)
            ) {
              //console.log('tredje+ brickan ligger bredvid och i rätt kolumn/rad!');
              usedColumn = indexColumn;
              usedRow = indexRow;
              correctlyPlaced.push(cell.letter);
            } else {
              //console.log('brickan ligger fel.');
              result = false;
            }
          }
        }
      })
    );
    console.log('Är ordet korrekt lagt?', result);
    let playedWord: string = correctlyPlaced.join('');
    console.log('Vilket ord har lagts?', playedWord);

    let inWordList = wordList.includes(playedWord.toLowerCase());
    console.log('Fanns ordet i listan?', inWordList);

    if (result && inWordList) {
      console.log('Ordet spelas!');
      const playedBoard = unplayedBoard.map((row, indexRow) =>
        row.map((cell, indexColumn) => {
          if (cell.placed === 'hand') {
            cell.placed = 'board';
          }
          return cell;
        })
      );
      setBoard(playedBoard);
    }
  };

  return (
    <>
      <BoardGrid>
        {unplayedBoard.map((row, indexRow) =>
          row.map((cell, indexColumn) => (
            <BoardCell
              isPlaced={cell.placed === 'board'}
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
          <SingleTile
            isSelected={tile === selectedTile}
            key={index}
            onClick={() => selectTile(tile)}
          >
            {tile.letter}
          </SingleTile>
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
  justifyItems: 'stretch',
  width: '75%'
}));

interface TileProps {
  readonly isSelected: boolean;
}

const SingleTile = styled('div', {
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
  justifyItems: 'stretch',
  width: '75%'
}));

const BoardCellContainer = styled('div')(() => ({
  border: '2px solid red'
}));

interface BoardCellProps {
  readonly isPlaced: boolean;
}

const BoardCell = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isPlaced'
})<BoardCellProps>(({ isPlaced }) => ({
  backgroundColor: isPlaced ? 'gainsboro' : 'white',
  border: '1px solid blue',
  maxWidth: '100%',
  width: '100%',
  aspectRatio: '1',
  fontSize: '3rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));
