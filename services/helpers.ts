import crypto from 'crypto';

export const shuffleArray = <T>(array: T[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const gravatar = (email: string | undefined) => {
  if (email) {
    const hash = crypto.createHash('md5').update(email).digest('hex');

    return 'https://www.gravatar.com/avatar/' + hash + '?d=retro';
  } else {
    return 'https://www.gravatar.com/avatar/?d=retro';
  }
};
