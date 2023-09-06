import { Prisma } from '@prisma/client';

export interface Tile {
  letter: string;
  placed: string;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: Error;
}

export type ResponseType<T> = SuccessResponse<T> | ErrorResponse;

export type GameWithEverything = Prisma.GameGetPayload<{
  include: {
    users: {
      include: {
        user: true;
      };
    };
    invitations: true;
    turns: {
      include: {
        moves: true;
      };
    };
  };
}>;

export type GameListData = Prisma.UsersOnGamesGetPayload<{
  include: {
    game: {
      include: {
        users: {
          orderBy: {
            user: {
              name: 'asc';
            };
          };
          include: {
            user: true;
          };
        };

        invitations: true;
      };
    };
  };
}>;
