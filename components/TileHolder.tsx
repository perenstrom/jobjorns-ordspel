import { styled } from '@mui/material';
import { Tile as TileType } from 'types/types';
import { Tile } from './Tile';

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
  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <TileHolderInner>
        {tiles.map((tile, index) => (
          <Tile
            tile={tile}
            status={selectedTile == tile ? 'selected' : 'hand'}
            key={index}
            onClick={() => selectTile(tile)}
          />
        ))}
        {tiles.length < 2 && (
          <div
            style={{
              width: '100%',
              aspectRatio: '1/1'
            }}
          ></div>
        )}
      </TileHolderInner>
    </div>
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
