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
    const displayQueryParam = (router.query.display as string) || 'default';
    //console.log('Display query param:', displayQueryParam);

    // Disable Framer Motion animations for this part
    //MotionGlobalConfig.skipAnimations = true;

    return (
      <ChakraProvider theme={theme}>
        <Fonts />
        <DisplayProvider displayNumber={displayQueryParam}>
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

// //! display input ist weg in _app.tsx. wieder reinmachen mit vor 06.09.24 -> und diese datei wiederherstellen mit vor 06.09.24. Dann aber app_1 und app_2 online falls nur app_2 geöffnet.

// import { useRouter as originalUseRouter } from 'next/router';
// import {
//   createContext,
//   PropsWithChildren,
//   useContext,
//   useEffect,
//   useState,
// } from 'react';
// type DisplayContextType = {
//   displayNumber: string;
// };

// export const DisplayContext = createContext<DisplayContextType>({
//   displayNumber: 'default',
// });

// export const DisplayProvider = ({ children }: PropsWithChildren<{}>) => {
//   const router = originalUseRouter();
//   const [displayNumber, setDisplayNumber] = useState<string>('default');

//   useEffect(() => {
//     const displayQueryParam = router.query.display as string;
//     if (displayQueryParam) {
//       setDisplayNumber(displayQueryParam);
//       console.log(`Display number set from URL: ${displayQueryParam}`);
//     }
//   }, [router.query.display]);

//   return (
//     <DisplayContext.Provider value={{ displayNumber }}>
//       {children}
//     </DisplayContext.Provider>
//   );
// };
// export const useRouter = () => {
//   const [isNavigating, setIsNavigating] = useState(false);
//   const router = originalUseRouter();
//   const { displayNumber } = useContext(DisplayContext);

//   const pushWithDisplay = async (path) => {
//     if (!isNavigating) {
//       setIsNavigating(true);

//       // Give some delay (300 ms) before processing the next navigation event.
//       setTimeout(async () => {
//         const hrefWithDisplay = `${path}?display=${displayNumber}`;
//         await router.push(hrefWithDisplay);
//         setIsNavigating(false);
//       }, 100);
//     }
//   };

//   return {
//     ...router,
//     pushWithDisplay,
//   };
// };
