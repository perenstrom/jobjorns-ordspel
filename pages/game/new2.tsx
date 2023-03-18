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
import CircularProgress from '@mui/material/CircularProgress';
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Typography
} from '@mui/material';
import crypto from 'crypto';

const NewGamePage: NextPage<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userWithId, setUserWithId] = useState<User>();

  const { user } = useUser();

  const toggleUser = (userId: number) => {
    let newSelectedUsers = [...selectedUsers];

    const index = newSelectedUsers.indexOf(userId);
    if (index === -1) {
      newSelectedUsers.push(userId);
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

  const gravatar = (email: string) => {
    const hash = crypto.createHash('md5').update(email).digest('hex');

    return 'https://www.gravatar.com/avatar/' + hash + '?d=retro';
  };

  if (userWithId && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#121212'
        }}
      >
        <Menu />
        <Container
          sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          {users.map((user, index) => (
            <CardActionArea
              onClick={() => toggleUser(user.id)}
              key={index}
              sx={{
                m: 1,
                width: 'calc(64px + 40px + 20ch)',
                display: 'inline-block'
              }}
            >
              <Card variant="outlined">
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
          ))}
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
