// ShopModal.tsx
import ShopModalStep0 from '@/components/kiosk/shop/ShopModalStep0';
import ShopModalStep1 from '@/components/kiosk/shop/ShopModalStep1';
import ShopModalStep3 from '@/components/kiosk/shop/ShopModalStep3';

import {
  Box,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { FaceSmileSharpRegular } from '@/components/icons/icons';
import ShopModalStepWarenkorb from '@/components/kiosk/shop/ShopModalStep2Warenkorb';
import { useCart } from '@/providers/CardContext';
import { useStepper } from '@/providers/StepperContext';
import { useEffect } from 'react';
import { KISOK_BORDERRADIUS } from 'src/constants';

function StepperChoose({ steps }) {
  const { activeStep, setActiveStep } = useStepper();
  const { removeLastFromCart, payment } = useCart();

  const handleStepClick = (index) => {
    if (payment != 'init') return;

    if (index <= activeStep) {
      if (steps[activeStep].title === 'Warenkorb') {
        removeLastFromCart();
      }

      setActiveStep(index);
    }
  };

  return (
    <Stepper size='lg' colorScheme='brand' index={activeStep}>
      {steps.map((step, index) => (
        <Step key={index} onClick={() => handleStepClick(index)}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={
                payment === 'success' ? (
                  <Icon as={FaceSmileSharpRegular} />
                ) : (
                  <StepNumber />
                )
              }
            />
          </StepIndicator>

          <Box flexShrink='0'>
            <StepTitle>
              <Text pl='1' py='0' as='i' fontSize='xl' fontWeight='400'>
                {step.title}
              </Text>
            </StepTitle>
          </Box>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
}

export function ModalProductCard({
  isOpen,
  onClose,
  selectedProduct,
  selectedCategory,
  formatPrice,
}) {
  const steps =
    selectedProduct == null
      ? [{ title: 'Warenkorb' }, { title: 'Bezahlvorgang' }]
      : selectedCategory && selectedCategory.mugs
        ? [
            { title: 'Artikel' },
            { title: 'Becherwahl' },
            { title: 'Warenkorb' },
            { title: 'Kasse' },
          ]
        : [{ title: 'Artikel' }, { title: 'Warenkorb' }, { title: 'Kasse' }];

  const {
    activeStep,
    setActiveStep,
    setSelectedSizeOption,
    setSelectedSugarOption,
  } = useStepper();

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0);
    }
  }, [isOpen, setActiveStep]);

  // only done when the modal opens
  useEffect(() => {
    if (isOpen && selectedProduct?.sizes.length > 0) {
      setSelectedSizeOption(selectedProduct.sizes[0]);
      setSelectedSugarOption('zero');
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0);
    }
  }, [isOpen, setActiveStep]);

  const bgColorModal = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode',
  );

  const { payment } = useCart();

  return (
    <Modal
      variant='kiosk'
      isOpen={isOpen}
      onClose={payment != 'waiting' ? null : onClose}
    >
      <ModalOverlay />

      <ModalContent
        maxW='100%'
        height='100%'
        minH='100%'
        maxH='100%'
        //height='90%'
        m='0'
        pt='0'
        pb='0'
        px='5'
        //bgColor={bgColorModal}
        borderRadius={KISOK_BORDERRADIUS}
      >
        <ModalHeader pb='5' width='95%'>
          {/* <StepperChoose steps={steps} /> */}

          <ModalCloseButton
            pr='5'
            pt='7'
            fontSize='2xl'
            _active={{ bgColor: 'transparent', borderColor: 'transparent' }}
            _focus={{
              outline: 'none',
              bgColor: 'transparent',
              borderColor: 'transparent',
            }}
            _hover={{ bgColor: 'transparent', borderColor: 'transparent' }}
            isDisabled={payment == 'processing'} //!###
          />
        </ModalHeader>

        {activeStep === 0 && (
          <ShopModalStep0 // Product
            selectedProduct={selectedProduct}
            selectedCategory={selectedCategory}
            formatPrice={formatPrice}
          />
        )}
        {selectedCategory &&
          selectedCategory.mugs &&
          activeStep === 1 && ( // Becherwahl
            <ShopModalStep1
              selectedProduct={selectedProduct}
              selectedCategory={selectedCategory}
              formatPrice={formatPrice}
            />
          )}
        {activeStep === 2 && (
          <ShopModalStepWarenkorb // Warenkorb
            onClose={onClose}
          />
        )}
        {activeStep === 3 && (
          <ShopModalStep3 // Bezahlvorgang
            herkunft='shop'
            onClose={onClose}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
