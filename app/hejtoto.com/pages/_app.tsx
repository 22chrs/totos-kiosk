// _app.tsx

import Layout from '@/components/layout';
import '@/internationalization/i18n';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { ChakraProvider } from '@chakra-ui/react';

// Import the WebSocket provider and hook
import { WebSocketProvider, useWebSocket } from '@/websocket/WebSocketContext';
import { DisplayProvider } from '@/providers/DisplayContext';

import { AppProps } from 'next/app';
import Fonts from '@/theme/fonts';
import theme from '@/theme/theme';

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
      <WebSocketProvider>
      <DisplayProvider displayNumber={displayQueryParam}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        </DisplayProvider>
      </WebSocketProvider>
    </ChakraProvider>
  );
};

export default App;
