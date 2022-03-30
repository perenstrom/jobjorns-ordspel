import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  ThemeProvider,
  StyledEngineProvider,
  CssBaseline
} from '@mui/material';
import { theme } from 'styles/theme';
import { UserProvider } from '@auth0/nextjs-auth0';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <UserProvider>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>

      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} key={router.asPath} />
        </ThemeProvider>
      </StyledEngineProvider>
    </UserProvider>
  );
}

export default MyApp;
