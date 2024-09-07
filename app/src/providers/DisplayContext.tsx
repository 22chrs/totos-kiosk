//! display input ist weg in _app.tsx. wieder reinmachen mit vor 06.09.24 -> und diese datei wiederherstellen mit vor 06.09.24. Dann aber app_1 und app_2 online falls nur app_2 geöffnet.

import { useRouter as originalUseRouter } from 'next/router';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
type DisplayContextType = {
  displayNumber: string;
};

export const DisplayContext = createContext<DisplayContextType>({
  displayNumber: 'default',
});

export const DisplayProvider = ({ children }: PropsWithChildren<{}>) => {
  const router = originalUseRouter();
  const [displayNumber, setDisplayNumber] = useState<string>('default');

  useEffect(() => {
    const displayQueryParam = router.query.display as string;
    if (displayQueryParam) {
      setDisplayNumber(displayQueryParam);
      console.log(`Display number set from URL: ${displayQueryParam}`);
    }
  }, [router.query.display]);

  return (
    <DisplayContext.Provider value={{ displayNumber }}>
      {children}
    </DisplayContext.Provider>
  );
};
export const useRouter = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = originalUseRouter();
  const { displayNumber } = useContext(DisplayContext);

  const pushWithDisplay = async (path) => {
    if (!isNavigating) {
      setIsNavigating(true);

      // Give some delay (300 ms) before processing the next navigation event.
      setTimeout(async () => {
        const hrefWithDisplay = `${path}?display=${displayNumber}`;
        await router.push(hrefWithDisplay);
        setIsNavigating(false);
      }, 100);
    }
  };

  return {
    ...router,
    pushWithDisplay,
  };
};
