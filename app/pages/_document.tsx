import { ColorModeScript } from '@chakra-ui/react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import theme from 'src/theme/theme';
// import matomoTrackingCode from 'src/utils/matomo';

class Doc extends Document {
  render() {
    return (
      <Html lang='de'>
        <Head>
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/assets/favicon/apple-touch-icon-180x180.png'
          />

          <link
            rel='shortcut icon'
            type='image/x-icon'
            href='/assets/favicon/favicon-32x32.ico'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='96x96'
            href='/assets/favicon/favicon-96x96.png'
          />

          <meta
            name='msapplication-square310x310logo'
            content='/assets/favicon/mstile-310x310.png'
          />
          <meta name='msapplication-TileColor' content='#fd5' />

          {/* <script
            dangerouslySetInnerHTML={{
              __html: matomoTrackingCode,
            }}
          /> */}
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Doc;
