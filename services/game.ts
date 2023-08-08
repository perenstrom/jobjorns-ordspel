import { allLettersData, bonusPointsSums } from 'data/defaults';
import { Tile } from 'types/types';
// import { ResponseType } from 'types/types';

export const checkTilesPlayed = (board: Tile[][]) => {
  const copiedBoard = [...board];
  let tilesPlayed = false; // minst en bricka måste läggas

  copiedBoard.forEach((row) =>
    row.forEach((cell) => {
      if (cell.placed === 'hand' || cell.placed === 'submitted') {
        tilesPlayed = true;
      }
    })
  );

  return tilesPlayed;
};

export const checkSameDirection = (board: Tile[][]) => {
  const copiedBoard = [...board];
  let sameDirection = true; // alla placerade brickor ska vara i samma riktning

  let usedRows: number[] = [];
  let usedColumns: number[] = [];

  copiedBoard.forEach((row, indexRow) =>
    row.forEach((cell, indexColumn) => {
      if (cell.placed === 'submitted' || cell.placed === 'hand') {
        if (!usedRows.includes(indexRow)) {
          usedRows.push(indexRow);
        }
        if (!usedColumns.includes(indexColumn)) {
          usedColumns.push(indexColumn);
        }
      }
    })
  );

  if (usedRows.length > 1 && usedColumns.length > 1) {
    sameDirection = false;
  }

  return sameDirection;
};

export const checkAdjacentPlacement = (board: Tile[][]) => {
  const copiedBoard = [...board];

  let adjacentPlacement = false; // placerade brickor får inte skapa en ö
  let noOtherTiles = true; // om det inte finns några andra brickor på spelplanen är det OK med en ö

  let adjacentTiles: { row: number; column: number }[] = [];
  copiedBoard.forEach((row, indexRow) =>
    row.forEach((cell, indexColumn) => {
      if (cell.placed === 'submitted' || cell.placed === 'hand') {
        adjacentTiles.push({ row: indexRow - 1, column: indexColumn }); // den ovanför
        adjacentTiles.push({ row: indexRow, column: indexColumn - 1 }); // den till vänster
        adjacentTiles.push({ row: indexRow, column: indexColumn + 1 }); // den till höger
        adjacentTiles.push({ row: indexRow + 1, column: indexColumn }); // den under
      } else if (cell.placed === 'board') {
        noOtherTiles = false;
      }
    })
  );

  adjacentTiles.forEach((tile) => {
    if (
      typeof copiedBoard[tile.row] !== 'undefined' &&
      typeof copiedBoard[tile.row][tile.column] !== 'undefined' &&
      (copiedBoard[tile.row][tile.column].placed === 'board' ||
        copiedBoard[tile.row][tile.column].placed === 'latest')
    ) {
      adjacentPlacement = true;
    }
  });

  return adjacentPlacement || noOtherTiles;
};

export const getPlayedWords = (board: Tile[][]) => {
  const copiedBoard = [...board];

  let rowHandIsPlayed: boolean[] = [];
  let columnHandIsPlayed: boolean[] = [];
  let rowFinished: boolean[] = [];
  let columnFinished: boolean[] = [];
  let rowLetters: string[][] = [];
  let columnLetters: string[][] = [];

  copiedBoard.forEach((row, indexRow) =>
    row.forEach((cell, indexColumn) => {
      if (typeof rowHandIsPlayed[indexRow] === 'undefined') {
        rowHandIsPlayed[indexRow] = false;
      }
      if (typeof columnHandIsPlayed[indexColumn] === 'undefined') {
        columnHandIsPlayed[indexColumn] = false;
      }
      if (typeof rowFinished[indexRow] === 'undefined') {
        rowFinished[indexRow] = false;
      }
      if (typeof columnFinished[indexColumn] === 'undefined') {
        columnFinished[indexColumn] = false;
      }
      if (typeof rowLetters[indexRow] === 'undefined') {
        rowLetters[indexRow] = [];
      }
      if (typeof columnLetters[indexColumn] === 'undefined') {
        columnLetters[indexColumn] = [];
      }

      if (cell.placed === 'hand' || cell.placed === 'submitted') {
        rowHandIsPlayed[indexRow] = true;
        columnHandIsPlayed[indexColumn] = true;

        rowLetters[indexRow].push(cell.letter);
        columnLetters[indexColumn].push(cell.letter);

        rowFinished[indexRow] = false;
        columnFinished[indexColumn] = false;
      } else if (cell.placed === 'no') {
        if (rowHandIsPlayed[indexRow] === false) {
          rowLetters[indexRow].length = 0;
        } else {
          rowFinished[indexRow] = true;
          rowLetters[indexRow].push(' ');
        }

        if (columnHandIsPlayed[indexColumn] === false) {
          columnLetters[indexColumn].length = 0;
        } else {
          columnFinished[indexColumn] = true;
          columnLetters[indexColumn].push(' ');
        }
      } else {
        if (!rowFinished[indexRow]) {
          rowLetters[indexRow].push(cell.letter);
        }
        if (!columnFinished[indexColumn]) {
          columnLetters[indexColumn].push(cell.letter);
        }
      }
    })
  );

  rowHandIsPlayed.forEach((value, index) => {
    if (value === false) {
      rowLetters[index].length = 0;
    }
  });

  columnHandIsPlayed.forEach((value, index) => {
    if (value === false) {
      columnLetters[index].length = 0;
    }
  });

  let playedLetterRanges = rowLetters.concat(columnLetters);

  let playedWords: string[] = [];
  let singleLetterWords: string[] = [];
  playedLetterRanges.forEach((range) => {
    if (range.length > 0) {
      let word = range.join('').trim();
      if (word.length > 1) {
        playedWords.push(word);
      } else if (word.length == 1) {
        singleLetterWords.push(word);
      }
    }
  });

  if (playedWords.length == 0 && singleLetterWords.length > 0) {
    playedWords.push(singleLetterWords[0]);
  }

  return playedWords;
};

export const checkCoherentWord = (board: Tile[][]) => {
  const copiedBoard = [...board];
  let coherentWord = true; // placerade brickor får inte ha ett mellanrum

  let playedWords = getPlayedWords(copiedBoard);

  playedWords.forEach((word) => {
    let singleCoherentWord = word.indexOf(' ') === -1;
    if (singleCoherentWord === false) {
      coherentWord = false;
    }
  });

  return coherentWord;
};

export const points = (letter: string) => {
  let point = allLettersData.find((tile) => tile.letter == letter)?.points;
  if (typeof point === 'undefined') {
    point = 0;
  }
  return point;
};

export const wordPoints = (word: string) => {
  return [...word]
    .map((letter) => points(letter))
    .reduce((accumulated, current) => accumulated + current, 0);
};

export const tilePoints = (board: Tile[][]) => {
  const copiedBoard = [...board];
  let placedTilesCount = 0;

  copiedBoard.forEach((row) =>
    row.forEach((cell) => {
      if (cell.placed === 'submitted' || cell.placed === 'hand') {
        placedTilesCount++;
      }
    })
  );

  let bonusPoints = 0;
  if (placedTilesCount > 1) {
    bonusPoints = bonusPointsSums[placedTilesCount - 1];
  }

  return bonusPoints;
};
