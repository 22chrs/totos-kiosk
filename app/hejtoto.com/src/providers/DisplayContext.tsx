import { useRouter as originalUseRouter } from 'next/router';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

type DisplayContextType = {
  displayNumber: string;
};

export const DisplayContext = createContext<DisplayContextType>({
  displayNumber: 'default',
});

export const DisplayProvider = ({
  children,
  displayNumber,
}: PropsWithChildren<{ displayNumber: string }>) => {
  return (
    <DisplayContext.Provider
      value={{
        displayNumber,
      }}
    >
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
      }, 300);
    }
  };

  return {
    ...router,
    pushWithDisplay,
  };
};
