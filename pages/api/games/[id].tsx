import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getGame = async (gameId: number) => {
  console.log('nu kör vi getGame i APIt');

  try {
    const getGamePrisma = await prisma.game.findUnique({
      where: {
        id: gameId
      },
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    });
    if (getGamePrisma === null) {
      return { message: 'Inget spel returnerades' };
    } else {
      console.log('getGamePrisma:', getGamePrisma);
      return {
        message: 'Det gick bra, här är spelet med användare och allt',
        data: getGamePrisma
      };
    }
  } catch (error) {
    console.log(error);
  }
};

const submitMove = async (
  gameId: number,
  userId: number,
  latestPlayedWord: string,
  latestPlayedBoard: string
) => {
  console.log('nu kör vi submitMove i APIt');

  try {
    const updateResult = await prisma.usersOnGames.update({
      data: {
        latestPlayedWord: latestPlayedWord,
        latestPlayedBoard: latestPlayedBoard,
        latestPlayedTime: new Date()
      },
      where: {
        userId_gameId: {
          userId: userId,
          gameId: gameId
        }
      }
    });
    if (updateResult !== null) {
      return { message: 'Draget sparades' };
    } else {
      throw new Error(
        'Något gick fel i sparandet av draget, updateResult var null'
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error('Det blev ett error som fångades i terminalen');
  }
};

const submitTurn = async (
  gameId: number,
  letters: string,
  board: string,
  latestWord: string
) => {
  console.log('nu kör vi (nya) submitTurn i APIt!');
  console.log({ letters, board, latestWord });

  try {
    const updateResult = await prisma.game.update({
      data: {
        letters,
        board,
        latestWord,
        users: {
          updateMany: {
            where: {
              gameId
            },
            data: {
              latestPlayedBoard: '',
              latestPlayedWord: ''
            }
          }
        }
      },
      where: {
        id: gameId
      }
    });
    if (updateResult !== null) {
      return { message: 'Ny tur sparades' };
    } else {
      throw new Error(
        'Något gick fel i sparandet av ny tur, updateResult var null'
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error('Det blev ett error som fångades i terminalen');
  }
};

interface PostRequestBodyMove {
  variant: 'move';
  userId: number;
  latestPlayedWord: string;
  latestPlayedBoard: string;
}
interface PostRequestBodyTurn {
  variant: 'turn';
  letters: string;
  board: string;
  latestWord: string;
}

const games = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' && req.body.variant == 'move') {
    return new Promise((resolve) => {
      const {
        userId,
        latestPlayedWord,
        latestPlayedBoard
      }: PostRequestBodyMove = req.body;
      console.log(req.body);

      submitMove(
        parseInt(req.query.id as string, 10),
        userId,
        latestPlayedWord,
        latestPlayedBoard
      )
        .then((result) => {
          console.log('result', result);
          res.status(200).json(result);
          resolve('');
        })
        .catch((error) => {
          res.status(500).end(error);
          resolve('');
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
    });
  } else if (req.method === 'POST' && req.body.variant == 'turn') {
    return new Promise((resolve) => {
      const { letters, board, latestWord }: PostRequestBodyTurn = req.body;
      console.log(req.body);

      submitTurn(
        parseInt(req.query.id as string, 10),
        letters,
        board,
        latestWord
      )
        .then((result) => {
          console.log('result', result);
          res.status(200).json(result);
          resolve('');
        })
        .catch((error) => {
          res.status(500).end(error);
          resolve('');
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
    });
  } else if (req.method === 'GET') {
    return new Promise((resolve) => {
      getGame(parseInt(req.query.id as string, 10))
        .then((result) => {
          console.log('result', result);
          res.status(200).json(result);
          resolve('');
        })
        .catch((error) => {
          res.status(500).end(error);
          resolve('');
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
    });
  } else {
    res.status(404).end();
  }
};

export default games;
