import React, { useEffect, useState } from 'react';
import { Button, styled } from '@mui/material';
import wordList from 'data/swedish.json';
import { defaultBoard } from 'data/defaults';
import { Tile } from 'types/types';
import { allTiles } from 'data/defaults';

const shuffleTilesPile = () => {
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  let copiedAllTiles: Tile[] = shuffleArray(allTiles);
  console.log('här har vi shufflade tiles', copiedAllTiles);
  return copiedAllTiles;
};

const emptyTile: Tile = {
  letter: '',
  placed: 'no'
};

export const Board: React.FC<{}> = () => {
  const [board, setBoard] = useState(defaultBoard);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [unusedTiles, setUnusedTiles] = useState<Tile[]>([]);
  const [unplayedBoard, setUnplayedBoard] = useState(board);
  const [selectedTile, setSelectedTile] = useState<Tile>(emptyTile);

  useEffect(() => {
    // slumpa tiles-listan och peta in de 7 första brickorna därifrån
    let copiedTiles = tiles;
    let copiedUnusedTiles = shuffleTilesPile();
    for (let i = copiedTiles.length; i < 7; i++) {
      copiedTiles.push(copiedUnusedTiles.pop());
    }
    copiedTiles = copiedTiles.map((tile) => {
      tile.placed = 'hand';
      return tile;
    });
    setTiles(copiedTiles);
    setUnusedTiles(copiedUnusedTiles);
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
    // criteria:
    let sameDirection = true; // alla placerade brickor ska vara i samma riktning
    let coherentWord = true; // placerade brickor får inte ha ett mellanrum
    let inWordList = true; // det lagda ordet måste finnas i ordlistan
    let extraWordsInList = true; // eventuella extraord som formas ortogonalt måste också finnas i ordlistan

    let firstRow: number;
    let firstColumn: number;
    let direction: 'row' | 'column';

    let i = 0;
    unplayedBoard.forEach((row, indexRow) =>
      row.forEach((cell, indexColumn) => {
        if (cell.placed === 'hand') {
          console.log('här är en lagd bricka', cell.letter);

          i++;

          if (i === 1) {
            // första lagda brickan - definiera row/column
            firstRow = indexRow;
            firstColumn = indexColumn;
          } else if (i === 2) {
            // andra lagda brickan
            if (indexRow === firstRow) {
              direction = 'row';
            } else if (indexColumn === firstColumn) {
              direction = 'column';
            } else {
              sameDirection = false;
            }
          } else if (i >= 3) {
            // tredje+ lagda brickan
            if (direction === 'row' && indexRow === firstRow) {
              // brickan ligger på samma row, OK
            } else if (direction === 'column' && indexColumn === firstColumn) {
              // brickan ligger på samma column, OK
            } else {
              sameDirection = false;
            }
          }
        }
      })
    );
    console.log('sameDirection', sameDirection);

    // andra loopen

    let lettersInRange = [];
    let lettersInAltRange = [];
    if (sameDirection) {
      i = 0;
      let handIsPlayed = false;
      let altHandIsPlayed = [];
      let indexToPush: number;
      unplayedBoard.forEach((row, indexRow) =>
        row.forEach((cell, indexColumn) => {
          if (!handIsPlayed && cell.placed === 'hand') {
            handIsPlayed = true;
          }

          if (
            (direction === 'row' && indexRow === firstRow) ||
            (direction === 'column' && indexColumn === firstColumn)
          ) {
            console.log('lagd bricka i rätt rad/kolumn', cell);
            if (cell.letter === '' && handIsPlayed) {
              lettersInRange.push(' ');
            } else if (cell.letter === '' && !handIsPlayed) {
              lettersInRange.length = 0;
            } else {
              lettersInRange.push(cell.letter);
            }
          } else {
            if (direction === 'row') {
              indexToPush = indexColumn;
            } else if (direction === 'column') {
              indexToPush = indexRow;
            }

            if (typeof altHandIsPlayed[indexToPush] === 'undefined') {
              altHandIsPlayed[indexToPush] = false;
            }
            if (typeof lettersInAltRange[indexToPush] === 'undefined') {
              lettersInAltRange[indexToPush] = [];
            }

            if (!altHandIsPlayed[indexToPush] && cell.placed === 'hand') {
              altHandIsPlayed[indexToPush] = true;
            }

            if (cell.letter === '' && altHandIsPlayed[indexToPush]) {
              console.log('push space');
              lettersInAltRange[indexToPush].push(' ');
            } else if (cell.letter === '' && !altHandIsPlayed[indexToPush]) {
              console.log('reset alt range');
              lettersInAltRange[indexToPush].length = 0;
            } else {
              console.log('push', cell.letter);
              lettersInAltRange[indexToPush].push(cell.letter);
            }
          }
        })
      );
    }
    console.log('lettersInRange', lettersInRange);
    console.log('lettersInAltRange', lettersInAltRange);
    let playedWord: string = lettersInRange.join('').trim();
    if (playedWord.indexOf(' ') !== -1) {
      coherentWord = false;
    }
    console.log('coherentWord', coherentWord);

    console.log('Vilket ord har lagts?', playedWord);

    inWordList = wordList.includes(playedWord.toLowerCase());
    console.log('inWordlist', inWordList);

    if (sameDirection && coherentWord && inWordList && extraWordsInList) {
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
