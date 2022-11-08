import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';
import { allTiles } from 'data/defaults';

const prisma = new PrismaClient();

const startGame = async (starter: User, players: User[]) => {
  console.log('nu kör vi startGame i APIt');

  players.push(starter);

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };
  let letters: string = shuffleArray(allTiles)
    .map((tile) => tile.letter)
    .join();

  try {
    const createResult = await prisma.game.create({
      data: {
        letters: letters,
        startedBy: {
          connect: {
            id: starter.id
          }
        },
        users: {
          create: players.map((player) => ({ userId: player.id }))
        }
      }
    });
    if (createResult !== null) {
      return { message: `Spelet skapades`, id: createResult.id };
    } else {
      throw new Error(
        'Något gick fel i skapandet av spelomgång, createResult var null'
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error('Det blev ett error som fångades i terminalen');
  }
};

const listGames = async (userId: number) => {
  console.log('nu kör vi listGames i APIt');

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
          include: {
            user: true
          }
        }
      }
    });
    if (listGamesPrisma === null) {
      return { message: 'Inga användare returnerades' };
    } else {
      console.log('listGamesPrisma:', listGamesPrisma);
      return {
        message: 'Det gick bra, här är spel med användare och allt',
        data: listGamesPrisma
      };
    }
  } catch (error) {
    console.log(error);
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
      console.log(req.body);

      if (!starter || !players) {
        res.status(400).end('Starter eller Players saknas');
        resolve('');
      } else {
        startGame(starter, players)
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
      }
    });
  } else if (req.method === 'GET') {
    return new Promise((resolve) => {
      listGames(parseInt(req.query.userid as string, 10))
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
