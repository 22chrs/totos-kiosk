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
import { useEffect, useState } from 'react';
import { WebSocketProvider } from '@/websocket/WebSocketContext';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [isTouchEnabled, setTouchEnabled] = useState(true); // State to manage touch input
  const [isTouchActive, setTouchActive] = useState(false); // State to track if touch is currently active

  const disableRightClick = () => {
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  };

  const disableHorizontalOverscroll = () => {
    const style = document.createElement('style');
    style.innerHTML = `
    html, body {
      overscroll-behavior-x: none;
    }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    console.log(
      'Disable Right Click:',
      process.env.NEXT_PUBLIC_DISABLE_RIGHT_CLICK,
    );
    console.log('Environment Mode:', process.env.NEXT_PUBLIC_ENVIRONMENT_MODE);

    if (process.env.NEXT_PUBLIC_DISABLE_RIGHT_CLICK === 'true') {
      disableRightClick();
      disableHorizontalOverscroll();
    }
  }, []);

  // Function to handle touch input
  const handleTouchInput = (callback) => {
    if (isTouchEnabled && !isTouchActive) {
      callback(); // Call the passed callback
      setTouchActive(true); // Mark touch as active

      // Re-enable touch after 0.5 seconds
      setTimeout(() => {
        setTouchActive(false);
      }, 500);
    }
  };

  const renderContent = () => {
    const displayQueryParam = (router.query.display as string) || 'default';

    return (
      <ChakraProvider theme={theme}>
        <Fonts />
        <DisplayProvider displayNumber={displayQueryParam}>
          <LayoutProvider>
            <WebSocketProvider>
              <KioskLayout>
                <StepperProvider>
                  <CartProvider>
                    <Component
                      {...pageProps}
                      key={router.route}
                      handleTouchInput={handleTouchInput} // Pass the handler to the component
                    />
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
