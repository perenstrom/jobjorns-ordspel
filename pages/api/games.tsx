import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';
import { allLetters } from 'data/defaults';
import { shuffleArray } from 'services/helpers';
import sendgrid from '@sendgrid/mail';
import he from 'he';
import { GameListNecessaryData } from 'types/types';
import { getUser } from 'services/authorization';

const prisma = new PrismaClient({
  log: ['warn', 'error']
});

export const startGame = async (
  starter: User['sub'],
  players: User[],
  emailList: string[]
) => {
  let newPlayers = players.map((player) => player.sub);
  newPlayers.push(starter);

  let invitations: string[] = [];

  let letters: string = shuffleArray(allLetters()).join();

  try {
    if (emailList.length > 0) {
      await Promise.all(
        emailList.map(async (email) => {
          const newPlayer = await prisma.user.findUnique({
            where: {
              email: email
            }
          });
          if (newPlayer !== null) {
            newPlayers.push(newPlayer.sub);
          } else {
            invitations.push(email);
          }
        })
      );
    }

    const createGame = await prisma.game.create({
      data: {
        letters: letters,
        startedBy: {
          connect: {
            sub: starter
          }
        },
        currentTurn: 1,
        users: {
          create: newPlayers.map((playerSub) => ({
            userSub: playerSub,
            userAccepted: playerSub == starter,
            status: playerSub == starter ? 'YOURTURN' : 'INVITED'
          }))
        },
        invitations: {
          create: invitations.map((email) => ({
            email: email
          }))
        }
      }
    });

    if (invitations.length > 0 && process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

      invitations.map(async (email) => {
        const message = {
          to: email,
          from: 'Jobjörns ordspel <jobjorn@jobjorn.se>',
          subject: starter + ' har bjudit in dig in till Jobjörns ordspel',
          text:
            'Hej!\n\n' +
            he.encode(starter) +
            ' har bjudit in dig till Jobj&ouml;rns ordspel.\n\n' +
            'Skapa ett konto p&aring; https://jobjorns-ordspel.vercel.app/ med din mailadress (' +
            he.encode(email) +
            ') s&aring; kan ni spela tillsammans!\n\n' +
            'Vill du inte ta emot den h&auml;r typen av inbjudningar? D&aring; kan du avs&auml;ga dig dem h&auml;r: <%asm_group_unsubscribe_raw_url%>\n\n' +
            'Allt gott,\nJobj&ouml;rn',
          html:
            'Hej!<br><br>' +
            he.encode(starter) +
            ' har bjudit in dig till <strong>Jobj&ouml;rns ordspel</strong>.<br><br>' +
            'Skapa ett konto p&aring; <a href="https://jobjorns-ordspel.vercel.app/">Jobj&ouml;rns ordspel</a> med din mailadress (' +
            he.encode(email) +
            ') s&aring; kan ni spela tillsammans!<br><br>' +
            'Vill du inte ta emot den h&auml;r typen av inbjudningar? D&aring; kan du <a href="<%asm_group_unsubscribe_raw_url%>">avs&auml;ga dig dem h&auml;r</a>.<br><br>' +
            'Allt gott,<br>Jobj&ouml;rn',
          asm: {
            groupId: 21182,
            groups_to_display: [21182]
          }
        };
        try {
          await sendgrid.send(message);
        } catch (error) {
          console.error(error);
        }
      });
    }

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

const listGames = async (userSub: string) => {
  try {
    const listGamesPrisma: GameListNecessaryData[] = await prisma.$queryRaw`
      SELECT 
        "UsersOnGames"."gameId" AS "id",
        "UsersOnGames"."status" AS "status",
        "UsersOnGames"."statusTime" AS "statusTime"
      FROM "UsersOnGames"
      WHERE "UsersOnGames"."userSub" = ${userSub}
      ORDER BY "UsersOnGames"."statusTime" DESC
      `;

    if (listGamesPrisma === null || typeof listGamesPrisma === 'undefined') {
      return { message: 'Inga spel returnerades' };
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
  emailList: string[];
}

const games = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { players, emailList }: PostRequestBody = req.body;

      const loggedInUser = getUser(req, res);
      const loggedInUserSub = loggedInUser?.sub;

      if (!loggedInUserSub || (!players && !emailList)) {
        res.status(400).end('Players saknas');
        resolve('');
      } else {
        startGame(loggedInUserSub, players, emailList)
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
      listGames(req.query.usersub as string)
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
