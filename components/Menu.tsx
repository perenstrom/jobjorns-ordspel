// import { useRouter } from 'next/router';
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
  Toolbar,
  Typography
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import GridOnIcon from '@mui/icons-material/GridOn';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';

export const Menu: React.FC<{}> = () => {
  const { user } = useUser();

  const [drawer, setDrawer] = useState(false);

  return (
    <AppBar position="relative" sx={{ marginBottom: '8px' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Jobjörns ordspel
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ pr: 0 }}
          onClick={() => setDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
        <List>
          {user && <ListItem>{user.name}</ListItem>}

          <Link href="/" passHref>
            <ListItemButton key={'Pågående spel'} component="a">
              <ListItemIcon>
                <GridOnIcon />
              </ListItemIcon>
              <ListItemText primary={'Pågående spel'} />
            </ListItemButton>
          </Link>

          <Link href="/game/new" passHref>
            <ListItemButton key={'Nytt spel'} component="a">
              <ListItemIcon>
                <GridOnIcon />
              </ListItemIcon>
              <ListItemText primary={'Nytt spel'} />
            </ListItemButton>
          </Link>
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
