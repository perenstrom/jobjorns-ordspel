import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updateWinningMove = async (moveId: number) => {
  try {
    const updateMove = await prisma.move.update({
      where: {
        id: moveId
      },
      data: {
        won: true
      }
    });

    if (updateMove === null) {
      return { message: 'Inget drag returnerades' };
    } else {
      return {
        message: 'Det gick bra, draget uppdaterades',
        data: updateMove
      };
    }
  } catch (error) {
    return { message: 'Det blev ett error: ' + error };
  }
};

interface PostRequestBody {
  moveId: number;
}

const moves = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { moveId }: PostRequestBody = req.body;

      updateWinningMove(moveId)
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

export default moves;
