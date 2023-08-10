import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export const Footer: React.FC<{}> = (props) => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 1 }} component="footer">
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {'© '}
        <Link color="inherit" href="https://jobjorn.se/">
          Jobjörn Folkesson
        </Link>{' '}
        {new Date().getFullYear()}
        {' 🍪 '}
        <Link href="/policy">Integritets- och cookie-policy</Link>
      </Typography>
    </Box>
  );
};
