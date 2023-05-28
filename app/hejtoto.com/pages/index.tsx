import IndexPageWebsite from './indexWebsite';
import IndexPageKiosk from './kiosk/index';

const IndexPage = () => {
  const isWebsocketEnabled =
    process.env.NEXT_PUBLIC_WEBSOCKET_SERVICE_ENV === 'useWebsocket';

  const isKioskDomain =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'kiosk.hejtoto.com' ||
      window.location.hostname === 'www.kiosk.hejtoto.com');

  return isWebsocketEnabled || isKioskDomain ? (
    <IndexPageKiosk />
  ) : (
    <IndexPageWebsite />
  );
};

export default IndexPage;
