import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Menu } from 'components/Menu';
import {
  useUser,
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Footer } from 'components/Footer';
import { getUser, listUsers, startGame } from 'services/local';
import { User } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { gravatar } from 'services/helpers';

const NewGamePage: NextPage<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [userWithId, setUserWithId] = useState<User>();

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

  const styleSelected = (user: User) => {
    const index = selectedUsers.indexOf(user);
    if (index === -1) {
      return {};
    } else {
      return {
        borderColor: 'whitesmoke',
        filter: 'drop-shadow(0px 0px 3px white)'
      };
    }
  };

  if (userWithId && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#121212'
        }}
      >
        <Menu />
        <Container maxWidth="md">
          <Grid container spacing={2}>
            {users.map((user, index) => (
              <Grid item sm={6} md={4} key={index} style={{ width: '100%' }}>
                <CardActionArea onClick={() => toggleUser(user)}>
                  <Card variant="outlined" style={styleSelected(user)}>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <CardContent sx={{ flexGrow: 0 }}>
                        <Avatar src={gravatar(user.email)} />
                      </CardContent>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography>{user.name}</Typography>
                      </CardContent>
                    </Box>
                  </Card>
                </CardActionArea>
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={() => startGame(userWithId, selectedUsers)}
            >
              Starta spelet
            </Button>
          </Stack>
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
