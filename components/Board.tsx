import React, { useEffect, useState } from 'react';
import { Button, styled } from '@mui/material';
import wordList from 'data/swedish.json';
import { defaultBoard } from 'data/defaults';
import { GameWithUsersWithUsers, Tile } from 'types/types';
import { User } from '@prisma/client';
import { submitMove } from 'services/local';

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
  game: GameWithUsersWithUsers;
  user: User;
}

export const Board = ({ game, user: currentUser }: BoardProps) => {
  const [unplayedBoard, setUnplayedBoard] = useState<Tile[][]>(defaultBoard);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile>(emptyTile);
  const [playerHasSubmitted, setPlayerHasSubmitted] = useState<boolean>(false);

  useEffect(() => {
    let newTiles: Tile[] = [];
    let gameTiles = game.letters.split(',');
    for (let i = newTiles.length; i < 7; i++) {
      let popped = gameTiles.shift();
      if (popped) {
        newTiles.push({ letter: popped, placed: 'hand' });
      }
    }

    const currentUserGame = game.users.find((x) => x.userId === currentUser.id);

    if (
      currentUserGame?.latestPlayedBoard &&
      currentUserGame.latestPlayedBoard.length > 0
    ) {
      setPlayerHasSubmitted(true);

      let currentBoard: Tile[][] = JSON.parse(
        currentUserGame.latestPlayedBoard
      );

      currentBoard.forEach((row) =>
        row.forEach((cell) => {
          if (cell.placed === 'hand' || cell.placed === 'submitted') {
            const index = newTiles.findIndex((x) => x.letter === cell.letter);
            if (index > -1) {
              newTiles.splice(index, 1);
            }
          }
        })
      );

      setUnplayedBoard(currentBoard);
    } else if (game.board && game.board.length > 0) {
      let currentBoard: Tile[][] = JSON.parse(game.board);
      setUnplayedBoard(currentBoard);
    }

    setTiles(newTiles);
  }, [game, currentUser]);

  const shuffleTileHolder = () => {
    let copiedTiles = shuffleArray(tiles);
    setTiles(copiedTiles);
  };

  const selectTile = (tile: Tile) => {
    setSelectedTile(tile);
  };

  const placeTile = (placedTile: Tile, row: number, column: number) => {
    const copiedBoard = [...unplayedBoard];
    const copiedTiles = [...tiles];
    if (placedTile.placed === 'board' || placedTile.placed === 'submitted') {
      // man borde få någon form av feedback när man trycker på en redan placerad bricka - kanske att den skakar till lite?
    } else if (placedTile.letter !== emptyTile.letter) {
      copiedTiles.push(placedTile);

      copiedBoard[row][column] = emptyTile;
      setSelectedTile(placedTile);
    } else if (selectedTile.letter !== emptyTile.letter) {
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

  const submitWord = async () => {
    const copiedBoard = [...unplayedBoard];

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

    copiedBoard.forEach((row, indexRow) =>
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

    let playedWords: string[] = [];
    playedLetterRanges.forEach((range) => {
      if (range.length > 0) {
        playedWords.push(range.join('').trim());
      }
    });

    let longestPlayedWord = '';
    playedWords.forEach((word) => {
      if (word.length > longestPlayedWord.length) {
        longestPlayedWord = word;
      }

      let singleWordInList = wordList.includes(word.toLowerCase());
      if (singleWordInList === false) {
        inWordList = false;
      }

      let singleCoherentWord = word.indexOf(' ') === -1;
      if (singleCoherentWord === false) {
        coherentWord = false;
      }
    });

    if (sameDirection && coherentWord && inWordList) {
      const submittedBoard = copiedBoard.map((row) =>
        row.map((cell) => {
          if (cell.placed === 'hand') {
            cell.placed = 'submitted';
          }
          return cell;
        })
      );
      const currentBoard = JSON.stringify(submittedBoard);

      let moveResult = await submitMove(
        game.id,
        currentUser.id,
        longestPlayedWord,
        currentBoard
      );
      console.log(moveResult);

      setPlayerHasSubmitted(true);

      setUnplayedBoard(submittedBoard);
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
      {playerHasSubmitted ? (
        <Button variant="contained" disabled>
          Spela ordet
        </Button>
      ) : (
        <Button variant="contained" onClick={() => submitWord()}>
          Spela ordet
        </Button>
      )}
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
    ? props.theme.palette.primary.light
    : props.theme.palette.primary.main,

  color: props.isSelected ? 'black' : 'white',
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
      ? props.theme.palette.primary.dark
      : props.isPlaced === 'hand'
      ? props.theme.palette.primary.main
      : props.isPlaced === 'submitted'
      ? props.theme.palette.success.dark
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
