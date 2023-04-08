import Layout from '@/components/layout';
import '@/internationalization/i18n';

import { useEffect, useState } from 'react';

import { ChakraProvider } from '@chakra-ui/react';

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

  if (!initialRenderComplete) return <></>;
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default App;
