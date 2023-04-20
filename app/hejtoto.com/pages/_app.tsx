// _app.tsx

import Layout from '@/components/layout';
import '@/internationalization/i18n';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ChakraProvider } from '@chakra-ui/react';

// Import the WebSocket provider and hook
import { DisplayProvider } from '@/providers/DisplayContext';
import { WebSocketProvider } from '@/websocket/WebSocketContext';

import Fonts from '@/theme/fonts';
import theme from '@/theme/theme';
import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const displayQueryParam = (router.query.display as string) || '1';

  //at the first render initialRenderComplete is false for hydration error
  const [initialRenderComplete, setInitialRenderComplete] =
    useState<boolean>(false);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);
  // to here anti error code
  if (!initialRenderComplete) return <></>;

  if (!router.isReady) {
    return null;
  }

  const { displayNumber } = pageProps;

  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <DisplayProvider displayNumber={displayQueryParam}>
        <WebSocketProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WebSocketProvider>
      </DisplayProvider>
    </ChakraProvider>
  );
};

export default App;
