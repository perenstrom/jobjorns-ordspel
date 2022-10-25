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
  const [userWithId, setUserWithId] = useState<User>();

  const { user } = useUser();

  useEffect(() => {
    const fetchUserWithId = async () => {
      if (user && user.email) {
        const newUserWithId = await getUser(user.email);

        if (newUserWithId.success) {
          setUserWithId(newUserWithId.data);
        }
      }
    };

    fetchUserWithId();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await listUsers();
      if (usersList.success && userWithId) {
        const filteredList = usersList.data.filter(
          (user) => user.id !== userWithId.id
        );
        setUsers(filteredList);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userWithId]);

  if (userWithId && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: '#121212'
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
                onClick={() => startGame(userWithId, autoCompleteValue)}
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
