import { Tile } from 'types/types';

export const defaultBoard = () => {
  const size = 11;

  const generateInner = () => {
    const inner = new Array<Tile>(size);
    for (let i = 0; i < size; i++) {
      inner[i] = { letter: '', placed: 'no' };
    }
    return inner;
  };

  const outer = new Array<Tile[]>(size);
  for (let i = 0; i < size; i++) {
    outer[i] = generateInner();
  }

  return outer;
};

export const allLettersData = [
  { letter: 'A', points: 1, count: 9 },
  { letter: 'E', points: 1, count: 8 },
  { letter: 'R', points: 1, count: 8 },
  { letter: 'S', points: 1, count: 8 },
  { letter: 'T', points: 1, count: 8 },
  { letter: 'D', points: 1, count: 6 },
  { letter: 'L', points: 1, count: 6 },
  { letter: 'N', points: 1, count: 6 },
  { letter: 'I', points: 2, count: 5 },
  { letter: 'O', points: 2, count: 5 },
  { letter: 'G', points: 2, count: 4 },
  { letter: 'K', points: 3, count: 3 },
  { letter: 'M', points: 3, count: 3 },
  { letter: 'F', points: 3, count: 2 },
  { letter: 'H', points: 3, count: 2 },
  { letter: 'V', points: 3, count: 2 },
  { letter: 'U', points: 4, count: 3 },
  { letter: 'B', points: 4, count: 2 },
  { letter: 'P', points: 4, count: 2 },
  { letter: 'Å', points: 4, count: 2 },
  { letter: 'Ä', points: 4, count: 2 },
  { letter: 'Ö', points: 4, count: 2 },
  { letter: 'J', points: 7, count: 1 },
  { letter: 'Y', points: 7, count: 1 },
  { letter: 'C', points: 8, count: 1 },
  { letter: 'X', points: 9, count: 1 },
  { letter: 'Z', points: 9, count: 1 },
  { letter: 'Q', points: 10, count: 1 }
];

export const allLetters = () =>
  allLettersData.flatMap((letterData) =>
    Array<string>(letterData.count).fill(letterData.letter)
  );
