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
    let inWordList = true; // de lagda orden måste finnas i ordlistan

    let i = 0;
    let rowHandIsPlayed = [];
    let columnHandIsPlayed = [];
    let rowFinished = [];
    let columnFinished = [];
    let rowLetters = [];
    let columnLetters = [];
    let previousRow = -1;
    let previousColumn = -1;

    unplayedBoard.forEach((row, indexRow) =>
      row.forEach((cell, indexColumn) => {
        if (typeof rowHandIsPlayed[indexRow] === 'undefined') {
          rowHandIsPlayed[indexRow] = false;
        }
        if (typeof columnHandIsPlayed[indexColumn] === 'undefined') {
          columnHandIsPlayed[indexColumn] = false;
        }
        if (typeof rowFinished[indexRow] === 'undefined') {
          rowFinished[indexRow] = false;
        }
        if (typeof columnFinished[indexColumn] === 'undefined') {
          columnFinished[indexColumn] = false;
        }
        if (typeof rowLetters[indexRow] === 'undefined') {
          rowLetters[indexRow] = [];
        }
        if (typeof columnLetters[indexColumn] === 'undefined') {
          columnLetters[indexColumn] = [];
        }

        if (cell.placed === 'hand') {
          rowHandIsPlayed[indexRow] = true;
          columnHandIsPlayed[indexColumn] = true;

          rowLetters[indexRow].push(cell.letter);
          columnLetters[indexColumn].push(cell.letter);

          rowFinished[indexRow] = false;
          columnFinished[indexColumn] = false;

          if (
            previousRow !== indexRow &&
            previousRow !== -1 &&
            previousColumn !== indexColumn &&
            previousColumn !== -1
          ) {
            console.log('här failar sameDirection', cell);
            sameDirection = false;
          }
          previousRow = indexRow;
          previousColumn = indexColumn;
        } else if (cell.placed === 'no') {
          if (rowHandIsPlayed[indexRow] === false) {
            rowLetters[indexRow].length = 0;
          } else {
            rowFinished[indexRow] = true;
            rowLetters[indexRow].push(' ');
          }

          if (columnHandIsPlayed[indexColumn] === false) {
            columnLetters[indexColumn].length = 0;
          } else {
            columnFinished[indexColumn] = true;
            columnLetters[indexColumn].push(' ');
          }
        } else {
          if (!rowFinished[indexRow]) {
            rowLetters[indexRow].push(cell.letter);
          }
          if (!columnFinished[indexColumn]) {
            columnLetters[indexColumn].push(cell.letter);
          }
        }
      })
    );

    rowHandIsPlayed.forEach((value, index) => {
      if (value === false) {
        rowLetters[index].length = 0;
      }
    });

    columnHandIsPlayed.forEach((value, index) => {
      if (value === false) {
        columnLetters[index].length = 0;
      }
    });

    let playedLetterRanges = rowLetters.concat(columnLetters);
    console.log('playedLetterRanges', playedLetterRanges);

    let playedWords = [];
    playedLetterRanges.forEach((range) => {
      if (range.length > 0) {
        playedWords.push(range.join('').trim());
      }
    });
    console.log('playedWords', playedWords);

    playedWords.forEach((word) => {
      let singleWordInList = wordList.includes(word.toLowerCase());
      console.log('singleWordInList', word, singleWordInList);
      if (singleWordInList === false) {
        inWordList = false;
      }

      let singleCoherentWord = word.indexOf(' ') === -1;
      console.log('singleCoherentWord', word, singleCoherentWord);
      if (singleCoherentWord === false) {
        coherentWord = false;
      }
    });

    if (sameDirection && coherentWord && inWordList) {
      console.log('Ordet spelas!');
      const playedBoard = unplayedBoard.map((row, indexRow) =>
        row.map((cell) => {
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
