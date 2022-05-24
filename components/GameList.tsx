import React, { useEffect } from 'react';
import { Button, List, ListItem } from '@mui/material';

export const GameList: React.FC<{}> = () => {
  useEffect(() => {
    // herpaderp
  }, []);

  return (
    <>
      <List>
        <ListItem>Spel 1</ListItem>
        <ListItem>Spel 2</ListItem>
        <ListItem>Spel 3</ListItem>
        <ListItem>Spel 4</ListItem>
        <ListItem>Spel 5</ListItem>
      </List>
      <Button variant="contained" href="/game/new">
        Nytt spel
      </Button>
    </>
  );
};
