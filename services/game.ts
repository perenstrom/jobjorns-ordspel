import { Tile } from 'types/types';

export const checkTilesPlayed = (board: Tile[][]) => {
  const copiedBoard = [...board];
  let tilesPlayed = false; // minst en bricka måste läggas

  copiedBoard.forEach((row) =>
    row.forEach((cell) => {
      if (cell.placed === 'hand') {
        tilesPlayed = true;
      }
    })
  );

  return tilesPlayed;
};
