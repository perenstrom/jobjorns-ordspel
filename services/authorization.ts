import { getSession } from '@auth0/nextjs-auth0';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);
  return session?.user as UserProfile | undefined;
};
