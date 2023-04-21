import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import {
  useUser,
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Footer } from 'components/Footer';
import { listUsers, startGame } from 'services/local';
import { User } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {
  Avatar,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import { faviconString, gravatar } from 'services/helpers';
import Head from 'next/head';
import { Loading } from 'components/Loading';

const NewGamePage: NextPage<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const { user } = useUser();

  const toggleUser = (user: User) => {
    let newSelectedUsers = [...selectedUsers];

    const index = newSelectedUsers.indexOf(user);
    if (index === -1) {
      newSelectedUsers.push(user);
    } else {
      newSelectedUsers.splice(index, 1);
    }

    setSelectedUsers(newSelectedUsers);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const newUsers = await listUsers();
      if (newUsers.success) {
        setUsers(newUsers.data);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (user && !loading) {
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
          <title>Jobjörns ordspel</title>
          <link rel="icon" href={faviconString()} key="favicon" />
        </Head>
        <Menu />
        <Container maxWidth="sm" sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{}}>
            Starta nytt spel
          </Typography>
          <List>
            {users.map(
              (listUser, index) =>
                user.sub !== listUser.sub && (
                  <ListItem
                    key={index}
                    onClick={() => toggleUser(listUser)}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={selectedUsers.indexOf(listUser) !== -1}
                      />
                    }
                    disablePadding
                  >
                    <ListItemButton
                      selected={selectedUsers.indexOf(listUser) !== -1}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={listUser.picture || gravatar(listUser.email)}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={listUser.name} />
                    </ListItemButton>
                  </ListItem>
                )
            )}
          </List>

          <Stack direction="row" spacing={1} sx={{ my: 1 }}>
            {selectedUsers.length > 0 ? (
              <Button
                variant="contained"
                onClick={() =>
                  startGame(
                    users.find((u) => u.sub === user.sub) as User,
                    selectedUsers
                  )
                }
              >
                Bjud in spelare
              </Button>
            ) : (
              <Button variant="contained" disabled>
                Bjud in spelare
              </Button>
            )}
          </Stack>
        </Container>
        <Footer />
      </Box>
    );
  } else {
    return <Loading />;
  }
};

export default withPageAuthRequired<WithPageAuthRequiredProps>(NewGamePage);
