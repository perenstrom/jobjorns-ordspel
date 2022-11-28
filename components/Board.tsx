import React, { useEffect, useState } from 'react';
import { Button, styled } from '@mui/material';
import wordList from 'data/swedish.json';
import { defaultBoard } from 'data/defaults';
import { GamesWithUsersWithUsers, Tile } from 'types/types';

const shuffleArray = <T,>(originalArray: T[]): T[] => {
  let newArray = [...originalArray];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = temp;
  }
  return newArray;
};

const emptyTile: Tile = {
  letter: '',
  placed: 'no'
};

interface BoardProps {
  game: GamesWithUsersWithUsers;
}

export const Board = ({ game }: BoardProps) => {
  const [board, setBoard] = useState(defaultBoard);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [unplayedBoard, setUnplayedBoard] = useState(board);
  const [selectedTile, setSelectedTile] = useState<Tile>(emptyTile);

  useEffect(() => {
    let copiedTiles = [];
    let gameTiles = game.letters.split(',');
    for (let i = copiedTiles.length; i < 7; i++) {
      let popped = gameTiles.pop();
      if (popped) {
        copiedTiles.push({ letter: popped, placed: 'hand' });
      }
    }

    setTiles(copiedTiles);
  }, [game.letters]);

  const shuffleTileHolder = () => {
    let copiedTiles = shuffleArray(tiles);
    setTiles(copiedTiles);
  };

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

    let rowHandIsPlayed: boolean[] = [];
    let columnHandIsPlayed: boolean[] = [];
    let rowFinished: boolean[] = [];
    let columnFinished: boolean[] = [];
    let rowLetters: string[][] = [];
    let columnLetters: string[][] = [];
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

    let playedWords: string[] = [];
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
      const playedBoard = unplayedBoard.map((row) =>
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
              isPlaced={cell.placed}
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
      <Button variant="outlined" onClick={() => shuffleTileHolder()}>
        Blanda brickor
      </Button>
      <Button variant="contained" onClick={() => submitWord()}>
        Spela ordet
      </Button>
    </>
  );
};

const TileHolder = styled('div')((props) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  margin: props.theme.spacing(1, 0),
  gap: props.theme.spacing(0.5),
  justifyItems: 'stretch',
  width: '100%'
}));

interface TileProps {
  readonly isSelected: boolean;
}

const SingleTile = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<TileProps>((props) => ({
  backgroundColor: props.isSelected
    ? props.theme.palette.success.dark
    : props.theme.palette.primary.dark,
  maxWidth: '100%',
  width: 'calc(100% - 2px)',
  aspectRatio: '1',
  fontSize: '2rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: props.theme.spacing(0.5),
  boxShadow: '1px 1px 0px #fff, 2px 2px 0px #fff'
}));

const BoardGrid = styled('div')((props) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(11, 1fr)',
  gridTemplateRows: 'repeat(11, 1fr)',
  gap: props.theme.spacing(0.5),
  justifyItems: 'stretch',
  width: '100%'
}));

interface BoardCellProps {
  readonly isPlaced: string;
}

const BoardCell = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isPlaced'
})<BoardCellProps>((props) => ({
  backgroundColor:
    props.isPlaced === 'board'
      ? props.theme.palette.secondary.dark
      : props.isPlaced === 'hand'
      ? props.theme.palette.primary.dark
      : props.theme.palette.grey[800],

  boxShadow: props.isPlaced !== 'no' ? '1px 1px 0px #fff' : '0',
  width: props.isPlaced !== 'no' ? 'calc(100% - 1px)' : '100%',

  maxWidth: '100%',
  aspectRatio: '1',
  fontSize: '1rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: props.theme.spacing(0.5)
}));
