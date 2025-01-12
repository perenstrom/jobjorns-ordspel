// import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { Stack } from '@mui/system';
import { gravatar } from 'services/helpers';
import { AddBox, Gavel, ViewList } from '@mui/icons-material';

export const Menu: React.FC<{}> = () => {
  const [drawer, setDrawer] = useState(false);

  const theme = useTheme();

  const foldMenu = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="relative" sx={{ marginBottom: '8px' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none' }} passHref>
            Ordbjörn
          </Link>
        </Typography>
        {foldMenu ? (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <ToolbarList />
        )}
      </Toolbar>
      {foldMenu && (
        <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
          <DrawerList />
        </Drawer>
      )}
    </AppBar>
  );
};

const ToolbarList: React.FC<{}> = () => {
  const { user } = useUser();

  return (
    <>
      {user ? (
        <Stack direction="row" spacing={1}>
          <Link href="/" passHref>
            <Button key={'Översikt'} sx={{ color: 'white' }}>
              Översikt
            </Button>
          </Link>

          <Link href="/game/new" passHref>
            <Button key={'Nytt spel'} sx={{ color: 'white' }}>
              Nytt spel
            </Button>
          </Link>
          <Link href="/tell-me-more" passHref>
            <Button key={'Regler'} sx={{ color: 'white' }}>
              Regler
            </Button>
          </Link>
          <Divider orientation="vertical" sx={{ height: 'auto' }} />
          <Link href="/api/auth/logout" passHref>
            <Button key={'Logga ut'} sx={{ color: 'white' }}>
              Logga ut
            </Button>
          </Link>
        </Stack>
      ) : (
        <Link href="/api/auth/login" passHref>
          <Button key={'Logga in'} sx={{ color: 'white' }}>
            Logga in
          </Button>
        </Link>
      )}
    </>
  );
};

const DrawerList: React.FC<{}> = () => {
  const { user } = useUser();

  return (
    <List>
      {user && user.email ? (
        <>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={user.picture || gravatar(user.email)} />
            </ListItemAvatar>
            {user.name}
          </ListItem>

          <Divider />

          <Link href="/" passHref>
            <ListItemButton key={'Översikt'}>
              <ListItemIcon>
                <ViewList />
              </ListItemIcon>
              <ListItemText primary={'Översikt'} />
            </ListItemButton>
          </Link>

          <Link href="/game/new" passHref>
            <ListItemButton key={'Nytt spel'}>
              <ListItemIcon>
                <AddBox />
              </ListItemIcon>
              <ListItemText primary={'Nytt spel'} />
            </ListItemButton>
          </Link>

          <Link href="/tell-me-more" passHref>
            <ListItemButton key={'Regler'}>
              <ListItemIcon>
                <Gavel />
              </ListItemIcon>
              <ListItemText primary={'Regler'} />
            </ListItemButton>
          </Link>

          <Divider />

          <Link href="/api/auth/logout" passHref>
            <ListItemButton key={'Logga ut'}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={'Logga ut'} />
            </ListItemButton>
          </Link>
        </>
      ) : (
        <Link href="/api/auth/login" passHref>
          <ListItemButton key={'Logga in'}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary={'Logga in'} />
          </ListItemButton>
        </Link>
      )}
    </List>
  );
};
