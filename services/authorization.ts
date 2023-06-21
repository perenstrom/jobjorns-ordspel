import { UserProfile, getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export const getUser = (req: NextApiRequest, res: NextApiResponse) => {
  const session = getSession(req, res);
  return session?.user as UserProfile | undefined;
};
