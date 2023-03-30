import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';
import { allLetters } from 'data/defaults';
import { shuffleArray } from 'services/helpers';

const prisma = new PrismaClient();

const startGame = async (starter: User, players: User[]) => {
  players.push(starter);

  let letters: string = shuffleArray(allLetters()).join();

  try {
    const createGame = await prisma.game.create({
      data: {
        letters: letters,
        startedBy: {
          connect: {
            id: starter.id
          }
        },
        currentTurn: 1,
        users: {
          create: players.map((player) => ({ userId: player.id }))
        }
      }
    });

    if (createGame !== null) {
      return { message: `Spelet skapades`, id: createGame.id };
    } else {
      throw new Error(
        'Något gick fel i skapandet av spelomgång, createResult var null'
      );
    }
  } catch (error) {
    throw new Error('Det blev ett error: ' + error);
  }
};

const listGames = async (userId: number) => {
  try {
    const listGamesPrisma = await prisma.game.findMany({
      where: {
        users: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        users: {
          orderBy: {
            userId: 'asc'
          },
          include: {
            user: true
          }
        },
        turns: {
          orderBy: {
            turnNumber: 'desc'
          },
          include: {
            moves: {
              orderBy: {
                userId: 'asc'
              }
            }
          }
        }
      }
    });
    if (listGamesPrisma === null) {
      return { message: 'Inga användare returnerades' };
    } else {
      return {
        message: 'Det gick bra, här är spel med användare och allt',
        data: listGamesPrisma
      };
    }
  } catch (error) {
    throw new Error('Det blev ett error: ' + error);
  }
};

interface PostRequestBody {
  starter: User;
  players: User[];
}

const games = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { starter, players }: PostRequestBody = req.body;

      if (!starter || !players) {
        res.status(400).end('Starter eller Players saknas');
        resolve('');
      } else {
        startGame(starter, players)
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
      }
    });
  } else if (req.method === 'GET') {
    return new Promise((resolve) => {
      listGames(parseInt(req.query.userid as string, 10))
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
