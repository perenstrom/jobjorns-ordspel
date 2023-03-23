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
  getPlayedWords
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
  }, [game, currentUser]);

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

      /*
      if (moveResult.turn && moveResult.turn.success) {
        newAlerts.push({
          severity: 'success',
          message: 'Du var den sista spelaren, nu börjar en ny tur.'
        });
      }
      */
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
      <Stack direction="row" spacing={1}>
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

const BoardGrid = styled('div')((props) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(11, 1fr)',
  gridTemplateRows: 'repeat(11, 1fr)',
  gap: props.theme.spacing(0.5),
  justifyItems: 'stretch',
  width: '100%',
  aspectRatio: '1/1'
}));
