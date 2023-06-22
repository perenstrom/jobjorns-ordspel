import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material';
import { Tile as TileType } from 'types/types';
import { Tile } from './Tile';
import { bonusPoints } from 'data/defaults';

interface TileHolderProps {
  tiles: TileType[];
  selectedTile: TileType;
  selectTile: (tile: TileType) => void;
}
export const TileHolder = ({
  tiles,
  selectedTile,
  selectTile
}: TileHolderProps) => {
  let [slicedBonusPoints, setSlicedBonusPoints] = useState<number[]>([]);

  useEffect(() => {
    let newBonusPoints = bonusPoints.slice(0, 8 - tiles.length);

    newBonusPoints.sort((a, b) => b - a);
    setSlicedBonusPoints(newBonusPoints);
  }, [tiles]);

  return (
    <TileHolderInner>
      {tiles.map((tile, index) => (
        <Tile
          tile={tile}
          status={selectedTile == tile ? 'selected' : 'hand'}
          key={index}
          onClick={() => selectTile(tile)}
        />
      ))}
      {slicedBonusPoints.map((bonusPoint, index) => (
        <BonusPoint key={index}>+{bonusPoint}</BonusPoint>
      ))}
    </TileHolderInner>
  );
};

const TileHolderInner = styled('div')((props) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  margin: props.theme.spacing(1, 0),
  gap: props.theme.spacing(0.25),
  justifyItems: 'stretch',
  width: '100%'
}));

const BonusPoint = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.5em',
  color: 'gray',
  aspectRatio: '1/1'
}));
