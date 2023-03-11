import { UserProfile } from '@auth0/nextjs-auth0';
import { User } from '@prisma/client';
import router from 'next/router';
import { ResponseType, GameWithEverything, Tile } from 'types/types';

export const addUser = (user: UserProfile) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/users';
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      name: user.name,
      picture: user.picture,
      email: user.email
    })
  };
  // här behöver vi deala med resultatet på ett rimligare sätt
  fetch(url, options)
    .then((response) => {
      if (response.status === 200) {
        response
          .json()
          .then((data) => console.log(data))
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.error(response.status);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getUser = (email: string): Promise<ResponseType<User>> => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/users/' + email;
  const options = {
    method: 'GET',
    headers: defaultHeaders
  };
  return fetch(url, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((response) => {
      return {
        success: true as const,
        data: response.data
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error
      };
    });
};

export const listUsers = (): Promise<ResponseType<User[]>> => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/users';
  const options = {
    method: 'GET',
    headers: defaultHeaders
  };
  return fetch(url, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((response) => {
      return {
        success: true as const,
        data: response.data
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error
      };
    });
};

export const startGame = (starter: User, players: User[]) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games';
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ starter, players })
  };
  fetch(url, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((response) => {
      router.push('/game/' + response.id);
    })
    .catch((error) => {
      return {
        success: false,
        error: error
      };
    });
};

export const getGame = (
  id: number
): Promise<ResponseType<GameWithEverything>> => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games/' + id;
  const options = {
    method: 'GET',
    headers: defaultHeaders
  };
  return fetch(url, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((response) => {
      return {
        success: true as const,
        data: response.data
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error
      };
    });
};

export const listGames = (
  userId: number
): Promise<ResponseType<GameWithEverything[]>> => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games?userid=' + userId;
  const options = {
    method: 'GET',
    headers: defaultHeaders
  };
  return fetch(url, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((response) => {
      return {
        success: true as const,
        data: response.data
      };
    })
    .catch((error) => {
      return {
        success: false as const,
        error: error
      };
    });
};

export const submitMove = async (
  gameId: number,
  userId: number,
  turnNumber: number,
  playedWord: string,
  playedBoard: string
) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games/' + gameId;
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      variant: 'move',
      userId,
      turnNumber,
      playedWord,
      playedBoard
    })
  };

  try {
    const moveResult = await (await fetch(url, options)).json();
    const turnResult = await runTurnEnd(gameId);

    return { move: moveResult, turn: turnResult };
  } catch (error) {
    return {
      move: { success: false, response: error },
      turn: { success: false, response: error }
    };
  }
};

export const runTurnEnd = async (gameId: number) => {
  const game = await getGame(gameId);

  if (game.success) {
    let playersCount = game.data.users.length;
    let lastTurn = game.data.turns.at(-1);
    let playedCount = lastTurn?.moves.length;

    if (playersCount == playedCount && playersCount > 0 && lastTurn) {
      let winningMove = lastTurn.moves[0];
      lastTurn.moves.map((move) => {
        if (
          move.playedPoints > winningMove.playedPoints ||
          (move.playedPoints == winningMove.playedPoints &&
            move.playedTime < winningMove.playedTime)
        ) {
          winningMove = move;
        }
      });

      updateWinningMove(winningMove.id);

      let letters = game.data.letters.split(',');
      let playedLetters: string[] = [];
      let playedBoard: Tile[][] = JSON.parse(winningMove.playedBoard);
      playedBoard.map((row) =>
        row.map((cell) => {
          if (cell.placed === 'submitted') {
            playedLetters.push(cell.letter);
          }
        })
      );
      playedLetters.forEach((letter) => {
        let index = letters.indexOf(letter);
        if (index > -1) {
          letters.splice(index, 1);
        }
      });
      let newLetters = letters.join(',');

      let winningBoard = winningMove.playedBoard.replaceAll(
        'submitted',
        'board'
      );

      try {
        const result = await submitTurnEnd(
          gameId,
          newLetters,
          winningBoard,
          winningMove.playedWord
        );
        if (result.success) {
          return { success: true, response: result.response };
        } else {
          throw new Error(result.response);
        }
      } catch (error) {
        return { success: false, response: error };
      }
    } else {
      return false as const;
    }
  } else {
    return { success: false, response: 'Game hittades inte' };
  }
};

export const submitTurnEnd = async (
  gameId: number,
  letters: string,
  board: string,
  latestWord: string
) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games/' + gameId;
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      variant: 'turn',
      letters,
      board,
      latestWord
    })
  };

  try {
    const result = await (await fetch(url, options)).json();

    return result;
  } catch (error) {
    return { success: false, response: error };
  }
};

export const updateWinningMove = async (moveId: number) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/moves/' + moveId;
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      moveId
    })
  };

  try {
    const result = await (await fetch(url, options)).json();

    return result;
  } catch (error) {
    return { success: false, response: error };
  }
};
