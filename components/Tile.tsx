import { points } from 'data/defaults';

import { blue, cyan, green, grey, red, teal } from '@mui/material/colors';
import { Tile as TypeTile } from 'types/types';

export const Tile = ({
  tile,
  status,
  onClick
}: {
  tile: TypeTile;
  status: string;
  onClick: () => void;
}) => {
  let fillColor;
  // hand, submitted, board, selected
  if (status == 'selected') {
    fillColor = cyan;
  } else if (status == 'hand') {
    fillColor = teal;
  } else if (status == 'submitted') {
    fillColor = green;
  } else if (status == 'board') {
    fillColor = blue;
  } else {
    console.log('okänd status:', status);
    fillColor = red;
  }

  if (status == 'no') {
    return (
      <div
        style={{
          width: '100%',
          backgroundColor: grey[800],
          aspectRatio: 1
        }}
        onClick={() => onClick()}
      />
    );
  } else {
    return (
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        onClick={() => onClick()}
      >
        <rect
          x="0"
          y="0"
          width="92%"
          height="92%"
          fill={fillColor[500]}
          rx="0"
          ry="0"
        />
        <text
          x="47.5%"
          y="52.5%"
          fontSize="6vw"
          fill="#FFFFFF"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {tile.letter}
        </text>
        <text
          x="80%"
          y="30%"
          fontSize="2vw"
          fill="#FFFFFF"
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {points(tile.letter)}
        </text>
        <polygon points="92,0 100,8 100,100 92,92" fill={fillColor[800]} />
        <polygon points="0,92 8,100 100,100 92,92" fill={fillColor[300]} />
      </svg>
    );
  }
};
