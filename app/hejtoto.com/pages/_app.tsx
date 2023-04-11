// _app.tsx

import Layout from '@/components/layout';
import '@/internationalization/i18n';

import { useEffect, useState } from 'react';

import { ChakraProvider } from '@chakra-ui/react';

// Import the WebSocket provider and hook
import { WebSocketProvider, useWebSocket } from '@/websocket/WebSocketContext';

import { AppProps } from 'next/app';
import Fonts from '@/theme/fonts';
import theme from '@/theme/theme';

const App = ({ Component, pageProps }: AppProps) => {
  //at the first render initialRenderComplete is false for hydration error
  const [initialRenderComplete, setInitialRenderComplete] =
    useState<boolean>(false);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  // to here anti error code

  if (!initialRenderComplete) return <></>;

  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <WebSocketProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WebSocketProvider>
    </ChakraProvider>
  );
};

export default App;
