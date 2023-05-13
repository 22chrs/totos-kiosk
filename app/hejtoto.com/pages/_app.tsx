import KioskLayout from '@/components/layout/KioskLayout';
import LayoutWebsite from '@/components/layout/LayoutWebsite';
import '@/internationalization/i18n';

import { useRouter } from 'next/router';

import { ChakraProvider } from '@chakra-ui/react';

// Import the WebSocket provider and hook
import { DisplayProvider } from '@/providers/DisplayContext';
import { WebSocketProvider } from '@/websocket/WebSocketContext';
import { AnimatePresence } from 'framer-motion';

import { LayoutProvider } from '@/providers/LayoutContext';
import Fonts from '@/theme/fonts';
import theme from '@/theme/theme';
import { AppProps } from 'next/app';
import { useEffect } from 'react';

// Disable right-click function
const disableRightClick = () => {
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
};

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.KIOSK === 'true') {
      disableRightClick();
    }
  }, []);

  console.log(
    'WebSocket server env:',
    process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_ENV
  );
  console.log(
    'WebSocket service env:',
    process.env.NEXT_PUBLIC_WEBSOCKET_SERVICE_ENV
  );

  const renderContent = () => {
    if (process.env.NEXT_PUBLIC_WEBSOCKET_SERVICE_ENV === 'false') {
      console.log('no websocket');
      return (
        <ChakraProvider theme={theme}>
          <Fonts />
          <DisplayProvider displayNumber={'default'}>
            <LayoutProvider>
              <LayoutWebsite>
                <AnimatePresence mode='wait' initial={true}>
                  <Component {...pageProps} key={router.route} />
                </AnimatePresence>
              </LayoutWebsite>
            </LayoutProvider>
          </DisplayProvider>
        </ChakraProvider>
      );
    } else {
      console.log('using websocket ..');
      const displayQueryParam = (router.query.display as string) || '1';
      console.log('Display query param:', displayQueryParam);
      return (
        <ChakraProvider theme={theme}>
          <Fonts />
          <DisplayProvider displayNumber={displayQueryParam}>
            <LayoutProvider>
              <WebSocketProvider>
                <KioskLayout>
                  <AnimatePresence mode='wait' initial={true}>
                    <Component {...pageProps} key={router.route} />
                  </AnimatePresence>
                </KioskLayout>
              </WebSocketProvider>
            </LayoutProvider>
          </DisplayProvider>
        </ChakraProvider>
      );
    }
  };

  return renderContent();
};

export default App;
