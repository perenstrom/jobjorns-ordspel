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

const NewGamePage: NextPage<{}> = () => {
  const [users, setUsers] = useState([]);

  console.log(users);

  useEffect(() => {
    const tempUsers = listUsers();
    setUsers(tempUsers);
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
