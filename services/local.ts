import { UserProfile } from '@auth0/nextjs-auth0';
import { User, UsersOnGames } from '@prisma/client';
import router from 'next/router';
import { ResponseType, GameWithUsersWithUsers } from 'types/types';

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
): Promise<ResponseType<GameWithUsersWithUsers>> => {
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
): Promise<ResponseType<GameWithUsersWithUsers[]>> => {
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
  latestPlayedWord: string,
  latestPlayedBoard: string
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
      latestPlayedWord,
      latestPlayedBoard
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
    let allUsersPlayed = true;
    let winningUser: UsersOnGames = game.data.users[0];

    game.data.users.map((user) => {
      if (!user.latestPlayedWord) {
        allUsersPlayed = false;
      } else if (
        winningUser &&
        winningUser.latestPlayedWord &&
        user.latestPlayedWord &&
        winningUser.latestPlayedWord?.length < user.latestPlayedWord.length
      ) {
        winningUser = user;
      }
    });

    if (
      allUsersPlayed &&
      winningUser &&
      winningUser.latestPlayedWord &&
      winningUser.latestPlayedWord.length > 0 &&
      winningUser.latestPlayedBoard &&
      winningUser.latestPlayedBoard.length > 0
    ) {
      let letters = game.data.letters.split(',');
      let playedLetters = winningUser.latestPlayedWord.split('');

      playedLetters.forEach((letter) => {
        let index = letters.indexOf(letter);
        if (index > -1) {
          letters.splice(index, 1);
        }
      });

      let newLetters = letters.join(',');

      let winningBoard = winningUser.latestPlayedBoard.replaceAll(
        'submitted',
        'board'
      );

      try {
        const result = await submitTurnEnd(
          gameId,
          newLetters,
          winningBoard,
          winningUser.latestPlayedWord
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
      return false;
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
