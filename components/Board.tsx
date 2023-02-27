import React, { useEffect, useState } from 'react';
import { Alert, AlertColor, Backdrop, Button, styled } from '@mui/material';
import wordList from 'data/swedish.json';
import { defaultBoard } from 'data/defaults';
import { GameWithUsersWithUsers, Tile as TypeTile } from 'types/types';
import { User } from '@prisma/client';
import { submitMove } from 'services/local';
import { Tile } from './Tile';

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

const emptyTile: TypeTile = {
  letter: '',
  placed: 'no'
};

interface BoardProps {
  game: GameWithUsersWithUsers;
  user: User;
  fetchGame: (gameId: number) => void;
}

type Alert = {
  severity: AlertColor;
  message: string;
};

export const Board = ({ game, user: currentUser, fetchGame }: BoardProps) => {
  const [unplayedBoard, setUnplayedBoard] = useState<TypeTile[][]>(
    defaultBoard()
  );
  const [tiles, setTiles] = useState<TypeTile[]>([]);
  const [selectedTile, setSelectedTile] = useState<TypeTile>(emptyTile);
  const [playerHasSubmitted, setPlayerHasSubmitted] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [backdrop, setBackdrop] = useState<boolean>(false);
  const [shakingTiles, setShakingTiles] = useState<number[]>([]);

  const addAlerts = (newAlerts: Alert[]) => {
    console.log({ newAlerts });
    setAlerts([...alerts, ...newAlerts]);
    setBackdrop(true);
  };
  const handleBackdropClose = () => {
    setAlerts([]);
    setBackdrop(false);
  };

  useEffect(() => {
    let newTiles: TypeTile[] = [];
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

      let currentBoard: TypeTile[][] = JSON.parse(
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
      let currentBoard: TypeTile[][] = JSON.parse(game.board);
      setUnplayedBoard(currentBoard);
    }

    setTiles(newTiles);
  }, [game, currentUser]);

  const shuffleTileHolder = () => {
    let copiedTiles = shuffleArray(tiles);
    setTiles(copiedTiles);
  };

  const selectTile = (tile: TypeTile) => {
    setSelectedTile(tile);
    console.log('tile was selected:', tile);
  };

  const placeTile = (placedTile: TypeTile, row: number, column: number) => {
    const copiedBoard = [...unplayedBoard];
    const copiedTiles = [...tiles];
    if (placedTile.placed === 'board' || placedTile.placed === 'submitted') {
      const newShakingTiles = [...shakingTiles];
      newShakingTiles.push(row * 100 + column);
      setShakingTiles(newShakingTiles);

      setTimeout(() => {
        setShakingTiles((shakingTiles) => {
          const newShakingTiles = [...shakingTiles];
          const index = newShakingTiles.findIndex(
            (x) => x == row * 100 + column
          );
          if (index > -1) {
            newShakingTiles.splice(index, 1);
          }
          return newShakingTiles;
        });
      }, 300);
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
    let tilesPlayed = false; // minst en bricka måste läggas
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
          tilesPlayed = true;

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
        let word = range.join('').trim();
        if (word.length > 1) {
          playedWords.push(word);
        }
      }
    });

    let longestPlayedWord = '';
    playedWords.forEach((word) => {
      console.log({ word });
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

    console.log({ tilesPlayed, sameDirection, coherentWord, inWordList });

    let newAlerts: Alert[] = [];
    if (tilesPlayed && sameDirection && coherentWord && inWordList) {
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

      if (moveResult.move.success) {
        setPlayerHasSubmitted(true);

        setUnplayedBoard(submittedBoard);
        newAlerts.push({
          severity: 'success',
          message: 'Du lade ett ord!'
        });
      }

      if (moveResult.turn && moveResult.turn.success) {
        fetchGame(game.id);
        setPlayerHasSubmitted(false);

        newAlerts.push({
          severity: 'success',
          message: 'Du var den sista spelaren, nu börjar en ny tur.'
        });
      }
    } else {
      if (!tilesPlayed) {
        newAlerts.push({
          severity: 'error',
          message: 'Minst en bricka måste läggas.'
        });
      }
      if (!sameDirection) {
        newAlerts.push({
          severity: 'error',
          message: 'Alla brickor måste placeras i samma rad/kolumn.'
        });
      }
      if (!coherentWord) {
        newAlerts.push({
          severity: 'error',
          message: 'Det lagda ordet får inte ha mellanrum i sig.'
        });
      }
      if (!inWordList) {
        newAlerts.push({
          severity: 'error',
          message: 'Alla ord måste finnas i ordlistan.'
        });
      }
    }
    addAlerts(newAlerts);
  };

  return (
    <>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column'
        }}
        open={backdrop}
        onClick={handleBackdropClose}
      >
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            severity={alert.severity}
            sx={{ width: '65vh', margin: '3px' }}
          >
            {alert.message}
          </Alert>
        ))}
      </Backdrop>
      <BoardGrid>
        {unplayedBoard.map((row, indexRow) =>
          row.map((cell, indexColumn) => (
            <Tile
              key={indexRow * 100 + indexColumn}
              shake={shakingTiles.includes(indexRow * 100 + indexColumn)}
              tile={cell}
              status={cell.placed}
              onClick={() => placeTile(cell, indexRow, indexColumn)}
            />
          ))
        )}
      </BoardGrid>
      <TileHolder>
        {tiles.map((tile, index) => (
          <Tile
            tile={tile}
            status={selectedTile == tile ? 'selected' : 'hand'}
            key={index}
            onClick={() => selectTile(tile)}
          />
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

const BoardGrid = styled('div')((props) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(11, 1fr)',
  gridTemplateRows: 'repeat(11, 1fr)',
  gap: props.theme.spacing(0.5),
  justifyItems: 'stretch',
  width: '100%',
  aspectRatio: '1/1'
}));
