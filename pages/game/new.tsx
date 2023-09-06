import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import {
  useUser,
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Footer } from 'components/Footer';
import { getUser, listUsers } from 'services/local';
import { User } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { startGame } from 'services/local';

const NewGamePage: NextPage<{}> = () => {
  const [autoCompleteValue, setAutoCompleteValue] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const { user } = useUser();
  if (user && user.email) {
    const userWithId = getUser(user.email);
    console.log('userWithId', userWithId);
  }

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

  if (user && loading) {
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
                onClick={() => startGame(user, autoCompleteValue)}
              >
                Starta spelet
              </Button>
            </Box>
          )}
        </Container>
        <Footer />
      </Box>
    );
  } else {
    console.log('här snurrar det bara');
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row'
        }}
      >
        <CircularProgress />
      </Container>
    );
  }
};

export default withPageAuthRequired<WithPageAuthRequiredProps>(NewGamePage);
