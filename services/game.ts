import wordList from 'data/swedish.json';
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

export const checkSameDirection = (board: Tile[][]) => {
  const copiedBoard = [...board];
  let sameDirection = true; // alla placerade brickor ska vara i samma riktning

  let previousRow = -1;
  let previousColumn = -1;

  copiedBoard.forEach((row, indexRow) =>
    row.forEach((cell, indexColumn) => {
      if (cell.placed === 'hand') {
        if (
          previousRow !== indexRow &&
          previousRow !== -1 &&
          previousColumn !== indexColumn &&
          previousColumn !== -1
        ) {
          sameDirection = false;
        }
        previousRow = indexRow;
        previousColumn = indexColumn;
      }
    })
  );

  return sameDirection;
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

      if (cell.placed === 'hand') {
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
  playedLetterRanges.forEach((range) => {
    if (range.length > 0) {
      let word = range.join('').trim();
      if (word.length > 1) {
        playedWords.push(word);
      }
    }
  });

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

export const checkInWordList = (board: Tile[][]) => {
  const copiedBoard = [...board];
  let inWordList = true; // de lagda orden måste finnas i ordlistan

  let playedWords = getPlayedWords(copiedBoard);

  playedWords.forEach((word) => {
    let singleWordInList = wordList.includes(word.toLowerCase());
    if (singleWordInList === false) {
      inWordList = false;
    }
  });

  return inWordList;
};
