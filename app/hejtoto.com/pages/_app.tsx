import KioskLayout from '@/components/layout/KioskLayout';
import LayoutWebsite from '@/components/layout/LayoutWebsite';
import '@/internationalization/i18n';

import { useRouter } from 'next/router';

import { ChakraProvider } from '@chakra-ui/react';

// Import the WebSocket provider and hook
import { CartProvider } from '@/providers/CardContext';
import { DisplayProvider } from '@/providers/DisplayContext';
import { AnimatePresence } from 'framer-motion';

import { LayoutProvider } from '@/providers/LayoutContext';

import { StepperProvider } from '@/providers/StepperContext';
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
    if (process.env.DISABLE_RIGHT_CLICK === 'true') {
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

  const isKioskDomain =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'kiosk.hejtoto.com' ||
      window.location.hostname === 'www.kiosk.hejtoto.com');

  const renderContent = () => {
    if (
      process.env.NEXT_PUBLIC_WEBSOCKET_SERVICE_ENV === 'false' &&
      !isKioskDomain
    ) {
      console.log('no websocket');
      return (
        <ChakraProvider theme={theme}>
          <Fonts />
          <DisplayProvider displayNumber={'default'}>
            <LayoutProvider>
              <LayoutWebsite>
                <StepperProvider>
                  <AnimatePresence mode='wait' initial={true}>
                    <Component {...pageProps} key={router.route} />
                  </AnimatePresence>
                </StepperProvider>
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
              {/* <WebSocketProvider> */}
              <KioskLayout>
                <StepperProvider>
                  <CartProvider>
                    <AnimatePresence mode='wait' initial={true}>
                      <Component {...pageProps} key={router.route} />
                    </AnimatePresence>
                  </CartProvider>
                </StepperProvider>
              </KioskLayout>
              {/* </WebSocketProvider> */}
            </LayoutProvider>
          </DisplayProvider>
        </ChakraProvider>
      );
    }
  };

  return renderContent();
};

export default App;
