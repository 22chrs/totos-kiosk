import IndexPageWebsite from './indexWebsite';
import IndexPageKiosk from './kiosk/index';

const IndexPage = () => {
  const isWebsocketEnabled =
    process.env.NEXT_PUBLIC_WEBSOCKET_SERVICE_ENV === 'useWebsocket';

  return isWebsocketEnabled ? <IndexPageKiosk /> : <IndexPageWebsite />;
};

export default IndexPage;
