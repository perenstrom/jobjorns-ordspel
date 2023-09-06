import { UserProfile } from '@auth0/nextjs-auth0';
import { Invitation, User } from '@prisma/client';
import router from 'next/router';
import {
  ResponseType,
  GameWithEverything,
  GameListNecessaryData
} from 'types/types';

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
      sub: user.sub,
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

export const startGame = (players: User[], emailList: string[]) => {
  console.log(players, emailList);
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games';
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ players, emailList })
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
  userSub: string
): Promise<ResponseType<GameListNecessaryData[]>> => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games?usersub=' + userSub;
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
  userSub: string,
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
      userSub,
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

export const acceptInvite = async (gameId: number, userSub: string) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games/' + gameId;
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ variant: 'accept', userSub })
  };

  try {
    const acceptResult = await (await fetch(url, options)).json();

    return { accept: acceptResult };
  } catch (error) {
    return {
      accept: { success: false, response: error }
    };
  }
};

export const declineInvite = async (gameId: number, userSub: string) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games/' + gameId;
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ variant: 'decline', userSub })
  };

  try {
    const declineResult = await (await fetch(url, options)).json();

    return { decline: declineResult };
  } catch (error) {
    return {
      decline: { success: false, response: error }
    };
  }
};

export const dismissRefusal = async (gameId: number, userSub: string) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games/' + gameId;
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ variant: 'dismiss', userSub })
  };

  try {
    const dismissResult = await (await fetch(url, options)).json();

    return { dismiss: dismissResult };
  } catch (error) {
    return {
      dismiss: { success: false, response: error }
    };
  }
};

export const getUpdatedInvitations = (
  email: string,
  sub: string
): Promise<ResponseType<Invitation[]>> => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/invitations?email=' + email + '&sub=' + sub;
  const options = {
    method: 'GET',
    headers: defaultHeaders
  };
  console.log('här görs en fetch för getUpdatedInvitations');
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

export const updateUser = async (user: User): Promise<ResponseType<User>> => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/user/';
  const options = {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify({ user })
  };

  try {
    const updatedUser = await (await fetch(url, options)).json();

    return { success: true as const, data: updatedUser };
  } catch (error) {
    return {
      success: false as const,
      error: error as Error
    };
  }
};
