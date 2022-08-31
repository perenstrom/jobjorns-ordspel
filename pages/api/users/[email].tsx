import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUser = async (email: string) => {
  console.log('nu kör vi getUser i APIt');

  try {
    const findSingleUser = await prisma.user.findUnique({
      where: { email: email }
    });
    if (findSingleUser) {
      return {
        message: 'Det gick bra, här är användaren',
        data: findSingleUser
      };
    } else {
      return { message: 'Något gick fel i hämtandet av användare' };
    }
  } catch (error) {
    console.log(error);
    return { message: 'Det blev ett error som fångades i terminalen' };
  }
};

interface UserEmail {
  email: string;
}

const user = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { email } = req.query as unknown as UserEmail;
    console.log('email', email);

    return new Promise((resolve) => {
      getUser(email)
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

export default user;
