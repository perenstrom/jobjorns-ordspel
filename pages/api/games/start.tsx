import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const startGame = async (starter: User, players: User[]) => {
  console.log('nu kör vi startGame i APIt');
  console.log(starter);
  console.log(players);

  try {
    /*
      id          Int      @id @default(autoincrement())
  letters     String
  startedAt   DateTime @default(now())
  startedBy   User     @relation(fields: [startedById], references: [id])
  startedById Int // relation scalar field

  users UsersOnGames[]

  @@map("games")
  */
    const createResult = await prisma.game.create({
      data: {
        letters: 'abcdefg',
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
      return { message: `Spelet skapades` };
    } else {
      return { message: 'Något gick fel i skapandet av användare' };
    }
  } catch (error) {
    console.log(error);
    return { message: 'Det blev ett error som fångades i terminalen' };
  }
};

const listUsers = async () => {
  console.log('nu kör vi listUsers i APIt');

  try {
    const listUsersPrisma = await prisma.user.findMany();
    if (listUsersPrisma === null) {
      return { message: 'Inga användare returnerades' };
    } else {
      return {
        message: 'Det gick bra, här är användarna',
        data: listUsersPrisma
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

const start = async (req: NextApiRequest, res: NextApiResponse) => {
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
      listUsers()
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

export default start;
