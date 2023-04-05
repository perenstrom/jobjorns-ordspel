import { NextApiRequest, NextApiResponse } from 'next';
import { Move, PrismaClient, Turn, User, UsersOnGames } from '@prisma/client';
import { allLetters } from 'data/defaults';
import { shuffleArray } from 'services/helpers';
import { GameWithEverything } from 'types/types';

const prisma = new PrismaClient();

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
          create: newPlayers.map((player) => ({ userId: player.id }))
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
  startedById: number;
  board: string;
  latestWord: string;
  currentTurn: number;
  userId: number;
  userAccepted: boolean;
  createdAt: Date;
  name: string;
  email: string;
  picture: string;
  turnId: number;
  turnNumber: number;
  turnStart: Date;
  moveId: number;
  moveUserId: number;
  playedWord: string;
  playedBoard: string;
  playedTime: Date;
  playedPoints: number;
  won: boolean;
};

const listGames = async (userId: number) => {
  console.log('nu kör vi listGamesRaw');
  try {
    const listGamesPrisma: GameWithEverythingRaw[] = await prisma.$queryRaw`
      SELECT 
        "games"."id" AS "gameId",
        "games"."letters",
        "games"."startedAt",
        "games"."startedById",
        "games"."board",
        "games"."latestWord",
        "games"."currentTurn",
        "GameParticipants"."userId" as "userId",
        "GameParticipants"."userAccepted",
        "GameParticipants"."createdAt",
        "users"."name",
        "users"."email",
        "users"."picture",
        "Turn"."id" as "turnId",
        "Turn"."turnNumber",
        "Turn"."turnStart",
        "Move"."id" as "moveId",
        "Move"."userId" as "moveUserId",
        "Move"."playedWord",
        "Move"."playedBoard",
        "Move"."playedTime",
        "Move"."playedPoints",
        "Move"."won"
      FROM "UsersOnGames" AS "UsersOwnGames"
      JOIN "games" ON "games"."id" = "UsersOwnGames"."gameId"
      JOIN "UsersOnGames" AS "GameParticipants" ON "GameParticipants"."gameId" = "games"."id"
      JOIN "users" ON "users"."id" = "GameParticipants"."userId"
      JOIN "Turn" ON "Turn"."gameId" = "games"."id"
      JOIN "Move" ON "Move"."turnId" = "Turn"."id"
      WHERE "UsersOwnGames"."userId" = ${userId}
      ORDER BY "games"."id" DESC, "GameParticipants"."userId" ASC, "users"."id" ASC, "Turn"."turnNumber" DESC, "Move"."userId" ASC`;

    if (listGamesPrisma === null || typeof listGamesPrisma === 'undefined') {
      return { message: 'Inga spel returnerades' };
    } else {
      let games: GameWithEverything[] = [];
      listGamesPrisma.forEach((gameRaw) => {
        let game: GameWithEverything = {
          id: gameRaw.gameId,
          letters: gameRaw.letters,
          startedAt: gameRaw.startedAt,
          startedById: gameRaw.startedById,
          board: gameRaw.board,
          latestWord: gameRaw.latestWord,
          currentTurn: gameRaw.currentTurn,
          users: [],
          turns: []
        };
        if (games.find((g) => g.id === game.id) === undefined) {
          games.push(game);
        }

        let user: UsersOnGames & { user: User } = {
          userId: gameRaw.userId,
          userAccepted: gameRaw.userAccepted,
          gameId: gameRaw.gameId,
          createdAt: gameRaw.createdAt,
          user: {
            id: gameRaw.userId,
            name: gameRaw.name,
            email: gameRaw.email,
            picture: gameRaw.picture
          }
        };
        if (
          games
            .find((g) => g.id === game.id)
            ?.users.find((u) => u.userId === user.userId) === undefined
        ) {
          games.find((g) => g.id === game.id)?.users.push(user);
        }

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

        let move: Move = {
          id: gameRaw.moveId,
          turnId: gameRaw.turnId,
          userId: gameRaw.moveUserId,
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
