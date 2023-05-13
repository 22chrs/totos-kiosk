import React, {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

type LayoutContextType = {
  header: ReactElement | null;
  footer: ReactElement | null;
  setHeader: (node: ReactElement | null) => void;
  setFooter: (node: ReactElement | null) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

type LayoutProviderProps = {
  children: ReactNode;
};

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [header, setHeader] = useState<ReactElement | null>(null);
  const [footer, setFooter] = useState<ReactElement | null>(null);

  return (
    <LayoutContext.Provider value={{ header, setHeader, footer, setFooter }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
};
