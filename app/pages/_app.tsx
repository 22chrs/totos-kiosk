// pages/_app.tsx

import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import { useEffect } from 'react';

import KioskLayout from '@/components/layout/KioskLayout';
import '@/internationalization/i18n';
import { CartProvider } from '@/providers/CardContext';
import { DisplayProvider } from '@/providers/DisplayContext';
import { LayoutProvider } from '@/providers/LayoutContext';
import { StepperProvider } from '@/providers/StepperContext';
import Fonts from '@/theme/fonts';
import theme from '@/theme/theme';
import { WebSocketProvider } from '@/websocket/WebSocketContext';
import { ClickControlProvider } from '@/providers/ClickControlContext'; // Import the ClickControlProvider

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

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
                    <ClickControlProvider>
                      <Component {...pageProps} key={router.route} />
                    </ClickControlProvider>
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
