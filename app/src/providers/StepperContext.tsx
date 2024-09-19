import { createContext, useContext, useState } from 'react';
import { Product } from '@/components/kiosk/shop/Interface';

interface StepperContextProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;

  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

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
  undefined,
);

export const StepperProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const [selectedProduct, _setSelectedProduct] = useState<Product | null>(null);
  const [selectedReusableOption, setSelectedReusableOption] =
    useState('einwegVariable');
  const [selectedLidOption, setSelectedLidOption] = useState('ohneDeckel');

  const [selectedSizeOption, setSelectedSizeOption] = useState<{
    size: string;
    additionalCost: number;
  } | null>(null);

  const [selectedSugarOption, setSelectedSugarOption] = useState('zero');

  // New function to set selectedProduct and initialize options synchronously
  const setSelectedProduct = (product: Product | null) => {
    _setSelectedProduct(product);

    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSizeOption(product.sizes[0]);
    } else {
      setSelectedSizeOption(null);
    }

    setSelectedSugarOption('zero'); // Or your default sugar level
  };

  return (
    <StepperContext.Provider
      value={{
        activeStep,
        setActiveStep,

        selectedProduct,
        setSelectedProduct,

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
