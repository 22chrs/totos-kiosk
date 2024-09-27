// providers/ClickControlContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

interface ClickControlContextProps {
  disableLeftClickForDuration: (duration?: number) => void;
  isLeftClickDisabled: boolean;
}

const ClickControlContext = createContext<ClickControlContextProps | undefined>(
  undefined,
);

export const ClickControlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLeftClickDisabled, setLeftClickDisabled] = useState(false);

  const disableLeftClickForDuration = useCallback(
    (duration: number = 5000) => {
      if (isLeftClickDisabled) return; // Prevent multiple triggers

      setLeftClickDisabled(true);

      setTimeout(() => {
        setLeftClickDisabled(false);
      }, duration);
    },
    [isLeftClickDisabled],
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (isLeftClickDisabled && event.button === 0) {
        // 0 is the left button
        event.preventDefault();
        event.stopPropagation();
        console.log('Left click disabled');
      }
    },
    [isLeftClickDisabled],
  );

  useEffect(() => {
    // Attach the event listener in capture phase
    document.addEventListener('mousedown', handleMouseDown, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, [handleMouseDown]);

  // **Trigger left-click disabling on mount**
  useEffect(() => {
    disableLeftClickForDuration(5000); // Disable for 5 seconds on mount
  }, [disableLeftClickForDuration]);

  return (
    <ClickControlContext.Provider
      value={{ disableLeftClickForDuration, isLeftClickDisabled }}
    >
      {children}
    </ClickControlContext.Provider>
  );
};

// Custom hook for easy access
export const useClickControl = (): ClickControlContextProps => {
  const context = useContext(ClickControlContext);
  if (!context) {
    throw new Error(
      'useClickControl must be used within a ClickControlProvider',
    );
  }
  return context;
};
