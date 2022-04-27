import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

interface User {
  name: string;
  picture: string;
  email: string;
}

const prisma = new PrismaClient();

const addUser = async (user: User) => {
  console.log('nu kör vi addUser i APIt');

  try {
    const findSingleUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (findSingleUser === null) {
      const createResult = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          picture: user.picture
        }
      });
      if (createResult !== null) {
        return { message: `Användaren ${user.name} skapades` };
      } else {
        return { message: 'Något gick fel i skapandet av användare' };
      }
    } else {
      return { message: 'Användaren finns redan' };
    }
  } catch (error) {
    console.log(error);
  }
};

const users = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { name, picture, email }: User = req.body;

      addUser({
        name,
        picture,
        email
      })
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

export default users;
