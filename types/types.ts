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

export type GamesWithUsersWithUsers = Prisma.GameGetPayload<{
  include: {
    users: {
      include: {
        user: true;
      };
    };
  };
}>;
