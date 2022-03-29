import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Typography
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import GridOnIcon from '@mui/icons-material/GridOn';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import { useUser } from '@auth0/nextjs-auth0';

export const Menu: React.FC<{}> = () => {
  const { user, error, isLoading } = useUser();

  const [drawer, setDrawer] = useState(false);
  const router = useRouter();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawer(open);
  };

  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Jobjörns ordspel
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer anchor="right" open={drawer} onClose={toggleDrawer(false)}>
        <List>
          {user && <ListItem>{user.name}</ListItem>}
          <ListItemButton key={'Pågående spel'}>
            <ListItemIcon>
              <GridOnIcon />
            </ListItemIcon>
            <ListItemText primary={'Pågående spel'} />
          </ListItemButton>

          <Divider />

          {user ? (
            <ListItemButton
              key={'Logga ut'}
              component="a"
              href="/api/auth/logout"
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={'Logga ut'} />
            </ListItemButton>
          ) : (
            <ListItemButton
              key={'Logga in'}
              component="a"
              href="/api/auth/login"
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary={'Logga in'} />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};
