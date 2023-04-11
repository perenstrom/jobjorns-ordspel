import { checkTilesPlayed } from 'services/game';
import { expect, test } from 'vitest';

test('checkTilesPlayed', () => {
  expect(checkTilesPlayed([[]])).toBe(false);
  expect(checkTilesPlayed([[{ placed: 'board', letter: 'A' }]])).toBe(false);
  expect(checkTilesPlayed([[{ placed: 'hand', letter: 'A' }]])).toBe(true);
  expect(checkTilesPlayed([[{ placed: 'no', letter: 'A' }]])).toBe(false);
  expect(
    checkTilesPlayed([
      [
        { placed: 'board', letter: 'A' },
        { placed: 'hand', letter: 'A' }
      ]
    ])
  ).toBe(true);
  expect(
    checkTilesPlayed([
      [
        { placed: 'board', letter: 'A' },
        { placed: 'no', letter: 'A' }
      ]
    ])
  ).toBe(false);
});
