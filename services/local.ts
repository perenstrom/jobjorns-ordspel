import { UserProfile } from '@auth0/nextjs-auth0';
import { User } from '@prisma/client';
import router from 'next/router';
import { ResponseType, GameWithEverything } from 'types/types';

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
  console.log('här görs en fetch för getGame');
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

    return { move: moveResult };
  } catch (error) {
    return {
      move: { success: false, response: error },
      turn: { success: false, response: error }
    };
  }
};
