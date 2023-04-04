import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertColor,
  Backdrop,
  Button,
  Stack,
  styled
} from '@mui/material';
import { defaultBoard } from 'data/defaults';
import { GameWithEverything, Tile as TileType } from 'types/types';
import { User } from '@prisma/client';
import { submitMove } from 'services/local';
import { Tile } from './Tile';
import { shuffleArray } from 'services/helpers';
import {
  checkCoherentWord,
  checkInWordList,
  checkSameDirection,
  checkTilesPlayed,
  getPlayedWords,
  wordPoints
} from 'services/game';
import Ably from 'ably';

const emptyTile: TileType = {
  letter: '',
  placed: 'no'
};

interface BoardProps {
  game: GameWithEverything;
  user: User;
  fetchGame: (gameId: number) => void;
}

type Alert = {
  severity: AlertColor;
  message: string;
};

export const Board = ({ game, user: currentUser, fetchGame }: BoardProps) => {
  const [unplayedBoard, setUnplayedBoard] = useState<TileType[][]>(
    defaultBoard()
  );
  const [tiles, setTiles] = useState<TileType[]>([]);
  const [selectedTile, setSelectedTile] = useState<TileType>(emptyTile);
  const [playerHasSubmitted, setPlayerHasSubmitted] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [backdrop, setBackdrop] = useState<boolean>(false);
  const [shakingTiles, setShakingTiles] = useState<number[]>([]);
  const [placedTiles, setPlacedTiles] = useState<number[]>([]);
  const [currentPoints, setCurrentPoints] = useState<number>(0);

  const addAlerts = (newAlerts: Alert[]) => {
    setAlerts([...alerts, ...newAlerts]);
    setBackdrop(true);
  };
  const handleBackdropClose = () => {
    setAlerts([]);
    setBackdrop(false);
  };

  useEffect(() => {
    const ablyApiKey = process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_KEY;
    if (ablyApiKey) {
      const ably = new Ably.Realtime.Promise(ablyApiKey);
      ably.connection.on((stateChange: Ably.Types.ConnectionStateChange) => {
        console.log(stateChange);
      });

      const channel = ably.channels.get('quickstart');
      channel.subscribe((message: Ably.Types.Message) => {
        if (message.name == 'turn' && message.data.gameId == game.id) {
          fetchGame(game.id);
          setBackdrop(true);
          setAlerts([{ severity: 'info', message: 'Nu börjar en ny tur!' }]);
          setPlayerHasSubmitted(false);
        }
      });

      return () => {
        channel.unsubscribe();
      };
    } else {
      console.log({ ablyApiKey });
    }
  }, [fetchGame, game.id]);

  useEffect(() => {
    let newTiles: TileType[] = [];
    let gameTiles = game.letters.split(',');
    for (let i = newTiles.length; i < 7; i++) {
      let popped = gameTiles.shift();
      if (popped) {
        newTiles.push({ letter: popped, placed: 'hand' });
      }
    }

    const latestTurn = game.turns[0];
    const latestUserMove = latestTurn?.moves.find(
      (move) => move.userId === currentUser.id
    );

    if (latestTurn?.turnNumber == game.currentTurn && latestUserMove) {
      setPlayerHasSubmitted(true);

      let currentBoard: TileType[][] = JSON.parse(latestUserMove.playedBoard);

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
      let currentBoard: TileType[][] = JSON.parse(game.board);
      setUnplayedBoard(currentBoard);
    }

    setTiles(newTiles);
    setPlacedTiles([]);
  }, [game, currentUser]);

  useEffect(() => {
    let points = wordPoints(getPlayedWords(unplayedBoard).join(', '));
    setCurrentPoints(points);
  }, [unplayedBoard]);

  const shuffleTileHolder = () => {
    let copiedTiles = shuffleArray(tiles);
    setTiles(copiedTiles);
  };

  const selectTile = (tile: TileType) => {
    setSelectedTile(tile);
  };

  const placeTile = (placedTile: TileType, row: number, column: number) => {
    const copiedBoard = [...unplayedBoard];
    const copiedTiles = [...tiles];
    if (placedTile.placed === 'board' || placedTile.placed === 'submitted') {
      // försök att trycka på en redan lagd bricka
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
      // plocka bort en lagd bricka

      copiedTiles.push(placedTile);
      copiedBoard[row][column] = emptyTile;
      setSelectedTile(placedTile);

      setPlacedTiles((placedTiles) => {
        const newPlacedTiles = [...placedTiles];
        const index = newPlacedTiles.findIndex((x) => x == row * 100 + column);
        if (index > -1) {
          newPlacedTiles.splice(index, 1);
        }
        return newPlacedTiles;
      });
    } else if (selectedTile.letter !== emptyTile.letter) {
      // lägg en bricka

      copiedBoard[row][column] = selectedTile;
      const index = copiedTiles.indexOf(selectedTile);
      if (index > -1) {
        copiedTiles.splice(index, 1);
      }
      setSelectedTile(emptyTile);

      const newPlacedTiles = [...placedTiles];
      newPlacedTiles.push(row * 100 + column);
      setPlacedTiles(newPlacedTiles);
    }

    setTiles(copiedTiles);
    setUnplayedBoard(copiedBoard);
  };

  const submitWord = async () => {
    setPlayerHasSubmitted(true);
    const copiedBoard = [...unplayedBoard];

    // criteria:
    let tilesPlayed = checkTilesPlayed(copiedBoard); // minst en bricka måste läggas
    let sameDirection = checkSameDirection(copiedBoard); // alla placerade brickor ska vara i samma riktning
    let coherentWord = checkCoherentWord(copiedBoard); // placerade brickor får inte ha ett mellanrum
    let inWordList = checkInWordList(copiedBoard); // de lagda orden måste finnas i ordlistan

    let newAlerts: Alert[] = [];
    if (tilesPlayed && sameDirection && coherentWord && inWordList) {
      newAlerts.push({
        severity: 'info',
        message: `Vänta, draget spelas...`
      });
      addAlerts(newAlerts);

      let playedWords = getPlayedWords(copiedBoard).join(', ');

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
        game.currentTurn,
        playedWords,
        currentBoard
      );

      if (moveResult.move.success) {
        setUnplayedBoard(submittedBoard);
        setPlacedTiles([]);
        setAlerts([
          {
            severity: 'success',
            message: `Du lade ${playedWords}!`
          }
        ]);
      } else {
        setAlerts([
          {
            severity: 'error',
            message: `Något gick fel med draget, försök igen`
          }
        ]);
        setPlayerHasSubmitted(false);
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

      setPlayerHasSubmitted(false);
      addAlerts(newAlerts);
    }
  };

  const passTurn = async () => {
    setPlayerHasSubmitted(true);
    const copiedBoard = [...unplayedBoard];

    let newAlerts: Alert[] = [];
    newAlerts.push({
      severity: 'info',
      message: `Vänta, draget spelas...`
    });
    addAlerts(newAlerts);

    let moveResult = await submitMove(
      game.id,
      currentUser.id,
      game.currentTurn,
      '',
      JSON.stringify(copiedBoard)
    );
    if (moveResult.move.success) {
      setUnplayedBoard(copiedBoard);
      setPlacedTiles([]);
      setAlerts([
        {
          severity: 'success',
          message: `Du passade!`
        }
      ]);
    } else {
      setAlerts([
        {
          severity: 'error',
          message: `Något gick fel med draget, försök igen`
        }
      ]);
      setPlayerHasSubmitted(false);
    }
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
            <BoardCell
              isPlaced={cell.placed}
              onClick={() => placeTile(cell, indexRow, indexColumn)}
              key={indexRow * 100 + indexColumn}
              shake={shakingTiles.includes(indexRow * 100 + indexColumn)}
              tile={cell}
              status={cell.placed}
              last={indexRow * 100 + indexColumn == Math.max(...placedTiles)}
              currentPoints={currentPoints}
              onClick={() => placeTile(cell, indexRow, indexColumn)}
            />
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
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" onClick={() => shuffleTileHolder()}>
          Blanda brickor
        </Button>
        {playerHasSubmitted ? (
          <>
            <Button variant="outlined" disabled>
              Passa
            </Button>
            <Button variant="contained" disabled>
              Spela ordet
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" onClick={() => passTurn()}>
              Passa
            </Button>
            <Button variant="contained" onClick={() => submitWord()}>
              Spela ordet
            </Button>
          </>
        )}
      </Stack>
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
