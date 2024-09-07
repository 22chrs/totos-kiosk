import { MotionGlobalConfig } from 'framer-motion';

import KioskLayout from '@/components/layout/KioskLayout';
import '@/internationalization/i18n';

import { useRouter } from 'next/router';

import { ChakraProvider } from '@chakra-ui/react';

// Import the WebSocket provider and hook
import { CartProvider } from '@/providers/CardContext';
import { DisplayProvider } from '@/providers/DisplayContext';

import { LayoutProvider } from '@/providers/LayoutContext';

import { StepperProvider } from '@/providers/StepperContext';
import Fonts from '@/theme/fonts';
import theme from '@/theme/theme';
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { WebSocketProvider } from '@/websocket/WebSocketContext';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  // Disable right-click function
  const disableRightClick = () => {
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  };

  useEffect(() => {
    // Log the environment variables
    console.log(
      'Disable Right Click:',
      process.env.NEXT_PUBLIC_DISABLE_RIGHT_CLICK,
    );
    console.log('Environment Mode:', process.env.NEXT_PUBLIC_ENVIRONMENT_MODE);

    if (process.env.NEXT_PUBLIC_DISABLE_RIGHT_CLICK === 'true') {
      disableRightClick();
    }
  }, []);

  const renderContent = () => {
    //console.log('using websocket ..');
    const displayQueryParam = (router.query.display as string) || '1';
    //console.log('Display query param:', displayQueryParam);

    // Disable Framer Motion animations for this part
    //MotionGlobalConfig.skipAnimations = true;

    return (
      <ChakraProvider theme={theme}>
        <Fonts />
        <DisplayProvider>
          <LayoutProvider>
            <WebSocketProvider>
              <KioskLayout>
                <StepperProvider>
                  <CartProvider>
                    {/* <AnimatePresence mode='wait' initial={true}> */}
                    <Component {...pageProps} key={router.route} />
                    {/* </AnimatePresence> */}
                  </CartProvider>
                </StepperProvider>
              </KioskLayout>
            </WebSocketProvider>
          </LayoutProvider>
        </DisplayProvider>
      </ChakraProvider>
    );
  };

  return renderContent();
};

export default App;
