import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 700;
        font-display: block;
        src: url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN7rgOXOhpKKSTj5PW.woff2) format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }
      /* latin */
      @font-face {
        font-family: 'noko';
        font-style: normal;
        font-weight: 800;
        font-display: block;
        src: url(https://use.typekit.net/af/c5737e/00000000000000007735f6e0/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3) format('woff2');
      }
      /* FUTURA PT */
      @font-face {
        font-family: 'futura-pt';
        font-style: normal;
        font-weight: 400;
        font-display: block;
        src: url(https://use.typekit.net/af/9b05f3/000000000000000000013365/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3) format('woff2');
      }
      @font-face {
        font-family: 'futura-pt';
        font-style: italic;
        font-weight: 400;
        font-display: block;
        src: url(https://use.typekit.net/af/cf3e4e/000000000000000000010095/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3) format('woff2');
      }
      @font-face {
        font-family: 'futura-pt';
        font-style: normal;
        font-weight: 700;
        font-display: block;
        src: url(https://use.typekit.net/af/309dfe/000000000000000000010091/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3) format('woff2');
      }
      @font-face {
        font-family: 'futura-pt';
        font-style: italic;
        font-weight: 700;
        font-display: block;
        src: url(https://use.typekit.net/af/eb729a/000000000000000000010092/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3) format('woff2');
      }
      `}
  />
);

export default Fonts;

// https://use.typekit.net/nud8uss.css
