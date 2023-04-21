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
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { AppProps } from 'next/dist/shared/lib/router/router';

const clientSideEmotionCache = createCache({ key: 'css', prepend: true });

import GlobalStyles from '@mui/material/GlobalStyles';

const inputGlobalStyles = (
  <>
    <CssBaseline />
    <GlobalStyles
      styles={{
        /*
        Josh's Custom CSS Reset
        https://www.joshwcomeau.com/css/custom-css-reset/
        */

        '*, *::before, *::after': {
          boxSizing: 'border-box'
        },
        '*': {
          margin: 0
        },
        'html, body, #__next': {
          height: '100%'
        },
        body: {
          lineHeight: '1.5',
          WebkitFontSmoothing: 'antialiased'
        },
        'img, picture, video, canvas, svg': {
          display: 'block',
          maxWidth: '100%'
        },
        'input, button, textarea, select': {
          font: 'inherit'
        },
        'p, h1, h2, h3, h4, h5, h6': {
          overflowWrap: 'break-word'
        },
        '#root, #__next': {
          isolation: 'isolate'
        }
      }}
    />
  </>
);

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
            {inputGlobalStyles}
            <Component {...pageProps} key={router.asPath} />
          </ThemeProvider>
        </StyledEngineProvider>
      </CacheProvider>
    </UserProvider>
  );
}

export default MyApp;
