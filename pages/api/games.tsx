import { NextApiRequest, NextApiResponse } from 'next';
import { Move, PrismaClient, Turn, User, UsersOnGames } from '@prisma/client';
import { allLetters } from 'data/defaults';
import { shuffleArray } from 'services/helpers';
import { GameWithEverything } from 'types/types';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

const startGame = async (starter: User, players: User[]) => {
  let newPlayers = [...players, starter];

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
          create: newPlayers.map((player) => ({
            userSub: player.sub,
            userAccepted: player.sub == starter.sub
          }))
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

type GameWithEverythingRaw = {
  gameId: number;
  letters: string;
  startedAt: Date;
  startedBySub: string;
  board: string;
  latestWord: string;
  currentTurn: number;
  finished: boolean;
  userSub: string;
  userAccepted: boolean;
  createdAt: Date;
  userId: number;
  sub: string;
  name: string;
  email: string;
  picture: string;
  turnId: number | null;
  turnNumber: number | null;
  turnStart: Date | null;
  moveId: number | null;
  moveUserSub: string | null;
  playedWord: string | null;
  playedBoard: string | null;
  playedTime: Date | null;
  playedPoints: number | null;
  won: boolean | null;
};

const listGames = async (userSub: string) => {
  console.log('nu kör vi listGamesRaw');
  try {
    const listGamesPrisma: GameWithEverythingRaw[] = await prisma.$queryRaw`
      SELECT 
        "games"."id" AS "gameId",
        "games"."letters",
        "games"."startedAt",
        "games"."startedBySub",
        "games"."board",
        "games"."latestWord",
        "games"."currentTurn",
        "games"."finished",
        "GameParticipants"."userSub" as "userSub",
        "GameParticipants"."userAccepted",
        "GameParticipants"."createdAt",
        "users"."id" as "userId",
        "users"."sub",
        "users"."name",
        "users"."email",
        "users"."picture",
        "Turn"."id" as "turnId",
        "Turn"."turnNumber",
        "Turn"."turnStart",
        "Move"."id" as "moveId",
        "Move"."userSub" as "moveUserSub",
        "Move"."playedWord",
        "Move"."playedBoard",
        "Move"."playedTime",
        "Move"."playedPoints",
        "Move"."won"
      FROM "UsersOnGames" AS "UsersOwnGames"
      JOIN "games" ON "games"."id" = "UsersOwnGames"."gameId"
      JOIN "UsersOnGames" AS "GameParticipants" ON "GameParticipants"."gameId" = "games"."id"
      JOIN "users" ON "users"."sub" = "GameParticipants"."userSub"
      LEFT JOIN "Turn" ON "Turn"."gameId" = "games"."id"
      LEFT JOIN "Move" ON "Move"."turnId" = "Turn"."id"
      WHERE "UsersOwnGames"."userSub" = ${userSub}
      ORDER BY "games"."id" DESC, "GameParticipants"."userSub" ASC, "users"."id" ASC, "Turn"."turnNumber" DESC, "Move"."userSub" ASC`;

    if (listGamesPrisma === null || typeof listGamesPrisma === 'undefined') {
      return { message: 'Inga spel returnerades' };
    } else {
      let games: GameWithEverything[] = [];
      listGamesPrisma.forEach((gameRaw) => {
        let game: GameWithEverything = {
          id: gameRaw.gameId,
          letters: gameRaw.letters,
          startedAt: gameRaw.startedAt,
          startedBySub: gameRaw.startedBySub,
          board: gameRaw.board,
          latestWord: gameRaw.latestWord,
          currentTurn: gameRaw.currentTurn,
          users: [],
          turns: [],
          finished: gameRaw.finished
        };
        if (games.find((g) => g.id === game.id) === undefined) {
          games.push(game);
        }

        let user: UsersOnGames & { user: User } = {
          userSub: gameRaw.userSub,
          userAccepted: gameRaw.userAccepted,
          gameId: gameRaw.gameId,
          createdAt: gameRaw.createdAt,
          user: {
            id: gameRaw.userId,
            sub: gameRaw.userSub,
            name: gameRaw.name,
            email: gameRaw.email,
            picture: gameRaw.picture
          }
        };
        if (
          games
            .find((g) => g.id === game.id)
            ?.users.find((u) => u.userSub === user.userSub) === undefined
        ) {
          games.find((g) => g.id === game.id)?.users.push(user);
        }

        if (gameRaw.turnId && gameRaw.turnNumber && gameRaw.turnStart) {
          let turn: Turn & { moves: Move[] } = {
            id: gameRaw.turnId,
            gameId: gameRaw.gameId,
            turnNumber: gameRaw.turnNumber,
            turnStart: gameRaw.turnStart,
            moves: []
          };
          if (
            games
              .find((g) => g.id === game.id)
              ?.turns.find((t) => t.id === turn.id) === undefined
          ) {
            games.find((g) => g.id === game.id)?.turns.push(turn);
          }

          if (
            gameRaw.moveId &&
            gameRaw.turnId &&
            gameRaw.moveUserSub &&
            gameRaw.playedWord &&
            gameRaw.playedBoard &&
            gameRaw.playedTime &&
            gameRaw.playedPoints &&
            gameRaw.won
          ) {
            let move: Move = {
              id: gameRaw.moveId,
              turnId: gameRaw.turnId,
              userSub: gameRaw.moveUserSub,
              playedWord: gameRaw.playedWord,
              playedBoard: gameRaw.playedBoard,
              playedTime: gameRaw.playedTime,
              playedPoints: gameRaw.playedPoints,
              won: gameRaw.won
            };
            if (
              games
                .find((g) => g.id === game.id)
                ?.turns.find((t) => t.id === turn.id)
                ?.moves.find((m) => m.id === move.id) === undefined
            ) {
              games
                .find((g) => g.id === game.id)
                ?.turns.find((t) => t.id === turn.id)

                ?.moves.push(move);
            }
          }
        }
      });

      return {
        message: 'Det gick bra, här är spel med användare och allt',
        data: games
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
