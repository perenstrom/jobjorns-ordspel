import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import {
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Footer } from 'components/Footer';
import { listUsers } from 'services/local';
import { User } from '@prisma/client';

const NewGamePage: NextPage<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>();

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
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          height: '100vh'
        }}
      >
        <>
          <Menu />
          <Container maxWidth="sm">
            {loading ? (
              <h2>Laddar...</h2>
            ) : (
              <Box>
                <ol>
                  {users.map((user: User, index) => (
                    <li key={index}>{user.name}</li>
                  ))}
                </ol>
              </Box>
            )}

            {/*
            <Autocomplete
              multiple
              id="tags-outlined"
              options={users}
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
              */}
          </Container>
        </>

        <Footer />
      </Box>
    </>
  );
};

export default withPageAuthRequired<WithPageAuthRequiredProps>(NewGamePage);
