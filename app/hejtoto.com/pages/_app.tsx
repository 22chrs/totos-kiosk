import Layout from '@/components/layout/Layout';
import '@/internationalization/i18n';

import { useRouter } from 'next/router';

import { ChakraProvider } from '@chakra-ui/react';

// Import the WebSocket provider and hook
import { DisplayProvider } from '@/providers/DisplayContext';
import { WebSocketProvider } from '@/websocket/WebSocketContext';
import { AnimatePresence } from 'framer-motion';

import Fonts from '@/theme/fonts';
import theme from '@/theme/theme';
import { AppProps } from 'next/app';
import { useEffect } from 'react';

// Disable right-click function
const kioskEnv = process.env.KIOSK;
const disableRightClick = () => {
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
};

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const displayQueryParam = (router.query.display as string) || '1';

  useEffect(() => {
    if (kioskEnv === 'true') {
      disableRightClick();
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <DisplayProvider displayNumber={displayQueryParam}>
        <WebSocketProvider>
          <Layout>
            <AnimatePresence mode='wait' initial={true}>
              <Component {...pageProps} key={router.route} />
            </AnimatePresence>
          </Layout>
        </WebSocketProvider>
      </DisplayProvider>
    </ChakraProvider>
  );
};

export default App;
