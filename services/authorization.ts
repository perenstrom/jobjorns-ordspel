import { UserProfile, getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export const getUser = (req: NextApiRequest, res: NextApiResponse) => {
  const session = getSession(req, res);
  console.log({ session });
  return session?.user as UserProfile | undefined;
};
