import { points } from 'services/game';

import {
  blue,
  cyan,
  green,
  grey,
  red,
  teal,
  yellow
} from '@mui/material/colors';
import { Tile as TypeTile } from 'types/types';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Badge } from '@mui/material';

export const Tile = ({
  tile,
  status,
  shake = false,
  last = false,
  currentPoints = 0,
  onClick
}: {
  tile: TypeTile;
  status: string;
  shake?: boolean;
  last?: boolean;
  currentPoints?: number;
  onClick: () => void;
}) => {
  let fillColor;
  let textColor;
  // hand, submitted, board, selected
  if (status == 'selected') {
    fillColor = cyan;
    textColor = '#ffffff';
  } else if (status == 'hand') {
    fillColor = teal;
    textColor = '#ffffff';
  } else if (status == 'submitted') {
    fillColor = green;
    textColor = '#ffffff';
  } else if (status == 'latest') {
    fillColor = yellow;
    textColor = '#000000';
  } else if (status == 'board') {
    fillColor = blue;
    textColor = '#ffffff';
  } else {
    fillColor = red;
    textColor = '#ffffff';
  }

  const tileAnimation = keyframes`
    0% { transform: translateX(0) }
    25% { transform: translateX(5px) }
    50% { transform: translateX(-5px) }
    75% { transform: translateX(5px) }
    100% { transform: translateX(0) }
  `;

  type ShakingWrapperProps = {
    shake: boolean;
  };

  const ShakingWrapper = styled('div')<ShakingWrapperProps>((props) => ({
    width: '100%',
    aspectRatio: '1/1',
    animationName: tileAnimation,
    animationDuration: '150ms',
    animationIterationCount: props.shake ? 2 : 0
  }));

  const totalPoints = () => {
    if (last) {
      return currentPoints;
    } else {
      return 0;
    }
  };

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
      <ShakingWrapper shake={shake}>
        <Badge
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          color="success"
          badgeContent={totalPoints()}
        >
          <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            onClick={() => onClick()}
            style={{ display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
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
              x="42.5%"
              y="52.5%"
              fontSize="4em"
              fill={textColor}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {tile.letter}
            </text>
            <text
              x="75%"
              y="30%"
              fontSize="2em"
              fill={textColor}
              textAnchor="middle"
              alignmentBaseline="central"
            >
              {points(tile.letter)}
            </text>
            <polygon points="92,0 100,8 100,100 92,92" fill={fillColor[800]} />
            <polygon points="0,92 8,100 100,100 92,92" fill={fillColor[300]} />
          </svg>
        </Badge>
      </ShakingWrapper>
    );
  }
};
