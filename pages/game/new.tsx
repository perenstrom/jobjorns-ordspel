import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import {
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Footer } from 'components/Footer';
import { listUsers } from 'services/local';
import { User } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const NewGamePage: NextPage<{}> = () => {
  const [autoCompleteValue, setAutoCompleteValue] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const usersList = await listUsers();
    if (usersList.success) {
      setUsers(usersList.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startGame = (players: User[]) => {
    console.log(players);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: '100vh'
      }}
    >
      <Menu />
      <Container maxWidth="sm">
        {loading || !users.length ? (
          <CircularProgress />
        ) : (
          <Box>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={users.sort(
                (a, b) => -b.name.localeCompare(a.name, ['sv', 'en'])
              )}
              value={autoCompleteValue}
              onChange={(event: any, newValue: User[]) => {
                setAutoCompleteValue(newValue);
              }}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bjud in spelare"
                  placeholder="Spelare"
                />
              )}
            />
            <Button
              variant="contained"
              onClick={() => startGame(autoCompleteValue)}
            >
              Starta spelet
            </Button>
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default withPageAuthRequired<WithPageAuthRequiredProps>(NewGamePage);
