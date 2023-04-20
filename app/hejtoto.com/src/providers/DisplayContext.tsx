import { createContext, PropsWithChildren } from 'react';

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
  console.log('displayNumber in DisplayProvider:', displayNumber);
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
