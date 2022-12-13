import { UserProfile } from '@auth0/nextjs-auth0';
import { User, UsersOnGames } from '@prisma/client';
import router from 'next/router';
import { ResponseType, GameWithUsersWithUsers } from 'types/types';

export const addUser = (user: UserProfile) => {
  console.log('nu kör vi addUser i local');

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
  fetch(url, options)
    .then((response) => {
      console.log(response);
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
  console.log('nu kör vi getUser i local');

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
  console.log('nu kör vi startGame i local.ts');

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
  console.log('nu kör vi getGame i local');

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

export const submitTurn = (
  gameId: number,
  userId: number,
  latestPlayedWord: string,
  latestPlayedBoard: string
) => {
  console.log('nu kör vi submitTurn i local.ts');
  console.log('gameId', gameId);
  console.log('userId', userId);
  console.log('latestPlayedWord', latestPlayedWord);
  console.log('latestPlayedBoard', latestPlayedBoard);

  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/games/' + gameId;
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ userId, latestPlayedWord, latestPlayedBoard })
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
      checkIfTurnEnd(gameId);
      console.log('hej hopp vad ska hända här då', response);
    })
    .catch((error) => {
      return {
        success: false,
        error: error
      };
    });
};

export const checkIfTurnEnd = async (gameId: number) => {
  console.log('nu kör vi checkIfTurnEnd i local.ts');
  console.log('gameId', gameId);

  const fetchGame = async () => {
    if (gameId > 0) {
      const newGame = await getGame(gameId);

      if (newGame.success) {
        return newGame.data;
      }
    }
  };
  let game = await fetchGame();
  if (game) {
    let allUsersPlayed = true;
    let winningUser: UsersOnGames = game.users[0];

    game.users.map((user) => {
      console.log('nu mappar vi igenom users', user.userId);
      if (!user.latestPlayedWord) {
        allUsersPlayed = false;
      } else if (
        winningUser &&
        winningUser.latestPlayedWord &&
        user.latestPlayedWord &&
        winningUser.latestPlayedWord?.length < user.latestPlayedWord.length
      ) {
        console.log('ny vinnare!');
        winningUser = user;
      }
    });

    console.log('winningUser', winningUser);
    console.log('allUsersPlayed', allUsersPlayed);
    if (allUsersPlayed && winningUser) {
      console.log('vi har en tur-vinnare');
    }
  }

  console.log(game);
};
