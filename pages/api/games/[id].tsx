import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { wordPoints } from 'services/game';

const prisma = new PrismaClient();

const getGame = async (gameId: number) => {
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
        },
        turns: {
          include: {
            moves: true
          }
        }
      }
    });
    if (getGamePrisma === null) {
      return { message: 'Inget spel returnerades' };
    } else {
      return {
        message: 'Det gick bra, här är spelet med användare och allt',
        data: getGamePrisma
      };
    }
  } catch (error) {
    return { message: 'Det blev ett error: ' + error };
  }
};

const submitMove = async (
  gameId: number,
  userId: number,
  turnNumber: number,
  playedWord: string,
  playedBoard: string
) => {
  try {
    const createMove = await prisma.move.create({
      data: {
        turn: {
          connectOrCreate: {
            where: {
              gameId_turnNumber: {
                gameId: gameId,
                turnNumber: turnNumber
              }
            },
            create: {
              game: {
                connect: {
                  id: gameId
                }
              },
              turnNumber: turnNumber
            }
          }
        },
        user: {
          connect: {
            id: userId
          }
        },
        playedWord: playedWord,
        playedBoard: playedBoard,
        playedPoints: wordPoints(playedWord)
      }
    });

    if (createMove !== null) {
      return { success: true, response: 'Draget sparades' };
    } else {
      throw new Error(
        'Något gick fel i sparandet av draget, createMove var null'
      );
    }
  } catch (error) {
    return { success: false, response: 'Det blev ett error: ' + error };
  }
};

const submitTurn = async (
  gameId: number,
  letters: string,
  board: string,
  latestWord: string
) => {
  try {
    const updateResult = await prisma.game.update({
      data: {
        letters,
        board,
        latestWord,
        currentTurn: {
          increment: 1
        }
      },
      where: {
        id: gameId
      }
    });
    if (updateResult !== null) {
      return { success: true, response: 'Ny tur sparades' };
    } else {
      throw new Error(
        'Något gick fel i sparandet av ny tur, updateResult var null'
      );
    }
  } catch (error) {
    return { success: false, response: 'Det blev ett error: ' + error };
  }
};

interface PostRequestBodyMove {
  variant: 'move';
  userId: number;
  turnNumber: number;
  playedWord: string;
  playedBoard: string;
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
        turnNumber,
        playedWord,
        playedBoard
      }: PostRequestBodyMove = req.body;

      submitMove(
        parseInt(req.query.id as string, 10),
        userId,
        turnNumber,
        playedWord,
        playedBoard
      )
        .then((result) => {
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

      submitTurn(
        parseInt(req.query.id as string, 10),
        letters,
        board,
        latestWord
      )
        .then((result) => {
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
