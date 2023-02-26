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
  { letter: 'A', count: 1, points: 9 },
  { letter: 'E', count: 1, points: 8 },
  { letter: 'R', count: 1, points: 8 },
  { letter: 'S', count: 1, points: 8 },
  { letter: 'T', count: 1, points: 8 },
  { letter: 'D', count: 1, points: 6 },
  { letter: 'L', count: 1, points: 6 },
  { letter: 'N', count: 1, points: 6 },
  { letter: 'I', count: 2, points: 5 },
  { letter: 'O', count: 2, points: 5 },
  { letter: 'G', count: 2, points: 4 },
  { letter: 'K', count: 3, points: 3 },
  { letter: 'M', count: 3, points: 3 },
  { letter: 'F', count: 3, points: 2 },
  { letter: 'H', count: 3, points: 2 },
  { letter: 'V', count: 3, points: 2 },
  { letter: 'U', count: 4, points: 3 },
  { letter: 'B', count: 4, points: 2 },
  { letter: 'P', count: 4, points: 2 },
  { letter: 'Å', count: 4, points: 2 },
  { letter: 'Ä', count: 4, points: 2 },
  { letter: 'Ö', count: 4, points: 2 },
  { letter: 'J', count: 7, points: 1 },
  { letter: 'Y', count: 7, points: 1 },
  { letter: 'C', count: 8, points: 1 },
  { letter: 'X', count: 9, points: 1 },
  { letter: 'Z', count: 9, points: 1 },
  { letter: 'Q', count: 10, points: 1 }
];

export const allLetters = () =>
  allLettersData.flatMap((letterData) =>
    Array<string>(letterData.count).fill(letterData.letter)
  );

export const points = (letter: string) =>
  allLettersData.find((tile) => tile.letter == letter)?.points;
