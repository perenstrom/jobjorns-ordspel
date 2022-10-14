import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  ThemeProvider,
  StyledEngineProvider,
  CssBaseline
} from '@mui/material';
import { theme } from 'styles/theme';
import { UserProvider } from '@auth0/nextjs-auth0';
import { AnimatePresence } from 'framer-motion';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { AppProps } from 'next/dist/shared/lib/router/router';

const clientSideEmotionCache = createCache({ key: 'css', prepend: true });

function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}: AppProps) {
  const router = useRouter();

  return (
    <UserProvider>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
        </Head>

        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AnimatePresence exitBeforeEnter>
              <Component {...pageProps} key={router.asPath} />
            </AnimatePresence>
          </ThemeProvider>
        </StyledEngineProvider>
      </CacheProvider>
    </UserProvider>
  );
}

export default MyApp;
