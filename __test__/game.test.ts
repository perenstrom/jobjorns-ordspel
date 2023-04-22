import {
  checkAdjacentPlacement,
  checkCoherentWord,
  checkSameDirection,
  checkTilesPlayed,
  getPlayedWords
} from 'services/game';
import { Tile } from 'types/types';
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

const checkSameDirectionTestData = [
  // true
  [
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'I',
        placed: 'submitted'
      },
      {
        letter: 'L',
        placed: 'submitted'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ]
  ],
  // false
  [
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'L',
        placed: 'hand'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'I',
        placed: 'hand'
      },
      {
        letter: 'A',
        placed: 'hand'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ]
  ],
  // false
  [
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'A',
        placed: 'hand'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'L',
        placed: 'hand'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ]
  ],
  // true
  [
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'A',
        placed: 'submitted'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'L',
        placed: 'submitted'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ]
  ]
];

test('checkSameDirection', () => {
  expect(checkSameDirection(checkSameDirectionTestData[0])).toBe(true);
  expect(checkSameDirection(checkSameDirectionTestData[1])).toBe(false);
  expect(checkSameDirection(checkSameDirectionTestData[2])).toBe(false);
  expect(checkSameDirection(checkSameDirectionTestData[3])).toBe(true);
});

const checkAdjacentPlacementTestData = [
  // false
  [
    [
      {
        letter: 'L',
        placed: 'hand'
      },
      {
        letter: 'G',
        placed: 'hand'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'F',
        placed: 'board'
      },
      {
        letter: 'A',
        placed: 'board'
      },
      {
        letter: 'S',
        placed: 'board'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ]
  ],
  // true
  [
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'L',
        placed: 'submitted'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'F',
        placed: 'board'
      },
      {
        letter: 'A',
        placed: 'board'
      },
      {
        letter: 'S',
        placed: 'board'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'G',
        placed: 'submitted'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ]
  ],
  // false
  [
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'F',
        placed: 'board'
      },
      {
        letter: 'A',
        placed: 'board'
      },
      {
        letter: 'S',
        placed: 'board'
      }
    ],
    [
      {
        letter: 'N',
        placed: 'hand'
      },
      {
        letter: 'K',
        placed: 'hand'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ]
  ],
  // true
  [
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'I',
        placed: 'submitted'
      },
      {
        letter: 'L',
        placed: 'submitted'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ]
  ]
];

test('checkAdjacentPlacement', () => {
  expect(checkAdjacentPlacement(checkAdjacentPlacementTestData[0])).toBe(false);
  expect(checkAdjacentPlacement(checkAdjacentPlacementTestData[1])).toBe(true);
  expect(checkAdjacentPlacement(checkAdjacentPlacementTestData[2])).toBe(false);
  expect(checkAdjacentPlacement(checkAdjacentPlacementTestData[3])).toBe(true);
});

const checkCoherentWordTestData = [
  // false
  [
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'B',
        placed: 'hand'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'I',
        placed: 'board'
      },
      {
        letter: 'L',
        placed: 'board'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'A',
        placed: 'hand'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ]
  ],
  // true
  [
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'B',
        placed: 'submitted'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'A',
        placed: 'submitted'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: 'I',
        placed: 'board'
      },
      {
        letter: 'L',
        placed: 'board'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ],
    [
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      },
      {
        letter: '',
        placed: 'no'
      }
    ]
  ]
];

test('checkCoherentWord', () => {
  expect(checkCoherentWord(checkCoherentWordTestData[0])).toBe(false);
  expect(checkCoherentWord(checkCoherentWordTestData[1])).toBe(true);
});

const getPlayedWordsTestData: Tile[][] = [
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'S', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'V', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'A', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'F', placed: 'board' },
    { letter: 'L', placed: 'board' },
    { letter: 'I', placed: 'board' },
    { letter: 'N', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'R', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'S', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'S', placed: 'board' },
    { letter: 'L', placed: 'board' },
    { letter: 'Ä', placed: 'board' },
    { letter: 'P', placed: 'board' },
    { letter: 'A', placed: 'hand' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'J', placed: 'board' },
    { letter: 'O', placed: 'board' },
    { letter: 'N', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: 'D', placed: 'hand' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'D', placed: 'board' },
    { letter: 'Ö', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'D', placed: 'hand' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'R', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'E', placed: 'hand' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'A', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: 'B', placed: 'board' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'R', placed: 'hand' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ],
  [
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: 'G', placed: 'board' },
    { letter: 'L', placed: 'board' },
    { letter: 'U', placed: 'board' },
    { letter: 'T', placed: 'board' },
    { letter: 'T', placed: 'board' },
    { letter: 'A', placed: 'hand' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' },
    { letter: '', placed: 'no' }
  ]
];

test('getPlayedWords', () => {
  expect(getPlayedWords(getPlayedWordsTestData)).toEqual([
    'SLÄPA',
    'GLUTTA',
    'ADDERA'
  ]);
});
