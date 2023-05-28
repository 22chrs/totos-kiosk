import { createContext, useContext, useState } from 'react';

interface StepperContextProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  selectedReusableOption: string;
  setSelectedReusableOption: React.Dispatch<React.SetStateAction<string>>;
  selectedLidOption: string;
  setSelectedLidOption: React.Dispatch<React.SetStateAction<string>>;

  selectedSizeOption: { size: string; additionalCost: number } | null;
  setSelectedSizeOption: React.Dispatch<
    React.SetStateAction<{ size: string; additionalCost: number } | null>
  >;
  selectedSugarOption: string;
  setSelectedSugarOption: React.Dispatch<React.SetStateAction<string>>;
}

const StepperContext = createContext<StepperContextProps | undefined>(
  undefined
);

export const StepperProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const [selectedReusableOption, setSelectedReusableOption] =
    useState('einwegVariable');
  const [selectedLidOption, setSelectedLidOption] = useState('ohneDeckel');

  const [selectedSizeOption, setSelectedSizeOption] = useState<{
    size: string;
    additionalCost: number;
  } | null>(null);

  const [selectedSugarOption, setSelectedSugarOption] = useState('0');

  return (
    <StepperContext.Provider
      value={{
        activeStep,
        setActiveStep,

        selectedReusableOption,
        setSelectedReusableOption,

        selectedLidOption,
        setSelectedLidOption,

        selectedSizeOption,
        setSelectedSizeOption,

        selectedSugarOption,
        setSelectedSugarOption,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (context === undefined) {
    throw new Error('useStepper must be used within a StepperProvider');
  }
  return context;
};
