import Layout from '@/components/layout/Layout';
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

  // At the first render initialRenderComplete is false for hydration error
  const [initialRenderComplete, setInitialRenderComplete] =
    useState<boolean>(false);

  useEffect(() => {
    setInitialRenderComplete(true);

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // To here anti error code
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
