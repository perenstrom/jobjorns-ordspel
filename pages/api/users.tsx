import { query } from 'lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

interface User {
  name: string;
  picture: string;
  email: string;
}

const addUser = async (user: User) => {
  console.log('nu kör vi addUser i APIt');
  try {
    const userExists = await query('SELECT * FROM users WHERE email = $1', [
      user.email
    ]);

    if (userExists.rowCount === 0) {
      console.log('här försöker vi lägga till användaren');

      const addUserQuery = await query(
        'INSERT INTO users (name, email, picture) VALUES ($1, $2, $3)',
        [user.name, user.email, user.picture]
      );

      if (addUserQuery.rowCount === 1) {
        return { message: 'Användaren tillagd' };
      } else {
        return { message: 'Något gick fel när användaren skulle läggas till' };
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
        });
    });
  } else {
    res.status(404).end();
  }
};

export default users;
