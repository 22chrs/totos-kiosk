import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      /* latin */
    
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

// @font-face {
//   font-family: 'futura-pt';
//   font-style: normal;
//   font-weight: 800;
//   font-display: block;
//   src: url("https://use.typekit.net/af/0c71d1/000000000000000000010097/27/d?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n8&v=3") format('woff2');
// }
// @font-face {
//   font-family: 'futura-pt';
//   font-style: italic;
//   font-weight: 800;
//   font-display: block;
//   src: url("https://use.typekit.net/af/648f69/000000000000000000010098/27/a?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=i8&v=3") format('woff2');
// }
