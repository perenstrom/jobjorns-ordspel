import { gravatar, shuffleArray } from 'services/helpers';
import { expect, test } from 'vitest';

test('gravatar', () => {
  expect(gravatar('')).toBe('https://www.gravatar.com/avatar/?d=retro');
  expect(gravatar('jobjorn@gmail.com')).toBe(
    'https://www.gravatar.com/avatar/a8ac07e24d3632cc4b6d815c19dae14c?d=retro'
  );
});

test('shuffleArray', () => {
  const array = [1, 2, 3, 4, 5];
  const shuffled = shuffleArray(array);
  expect(shuffled).not.toBe(array);
  expect(array.length).toBe(shuffled.length);
});
