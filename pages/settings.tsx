import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Footer } from 'components/Footer';
import { User } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {
  List,
  ListItem,
  ListItemButton,
  Switch,
  Typography
} from '@mui/material';
import { faviconString } from 'services/helpers';
import Head from 'next/head';
import { Loading } from 'components/Loading';
import { getUser, updateUser } from 'services/local';

const NewGamePage: NextPage<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [databaseUser, setDatabaseUser] = useState<User | null>(null);
  const [settingVisibility, setSettingVisibility] = useState<boolean>(true);

  const { user } = useUser();

  useEffect(() => {
    const fetchUser = async (email: string) => {
      if (email) {
        const newDatabaseUser = await getUser(email);

        if (newDatabaseUser.success && newDatabaseUser.data) {
          setDatabaseUser(newDatabaseUser.data);
          setLoading(false);
        }
      }
    };

    if (user && user.email) {
      fetchUser(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (databaseUser) {
      setSettingVisibility(databaseUser.settingVisibility);
    }
  }, [databaseUser]);

  const toggleVisibility = async () => {
    if (databaseUser) {
      setSettingVisibility(!settingVisibility);

      let newUser = { ...databaseUser };
      newUser.settingVisibility = !settingVisibility;
      let updateResponse = await updateUser(newUser);
      if (updateResponse && updateResponse.success) {
        setDatabaseUser(updateResponse.data);
      }
    }
  };

  if (user && databaseUser && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
          flexDirection: 'column',
          minHeight: '100%',
          backgroundColor: '#121212'
        }}
      >
        <Head>
          <title>Inställningar | Ordbjörn</title>
          <link rel="icon" href={faviconString()} key="favicon" />
        </Head>
        <Menu />
        <Container maxWidth="sm" sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{}}>
            Inställningar
          </Typography>
          <List>
            <ListItem
              onClick={() => toggleVisibility()}
              secondaryAction={
                <Switch
                  checked={settingVisibility}
                  onChange={toggleVisibility}
                />
              }
              disablePadding
            >
              <ListItemButton>
                Visa mig i användarlistan under &ldquo;Nytt spel&rdquo;
              </ListItemButton>
            </ListItem>
          </List>
        </Container>
        <Footer />
      </Box>
    );
  } else {
    return <Loading />;
  }
};

export default withPageAuthRequired(NewGamePage);
