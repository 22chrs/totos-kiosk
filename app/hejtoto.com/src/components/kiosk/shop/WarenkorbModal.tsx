// WarenkorbModal.tsx

import ShopModalStep3 from '@/components/kiosk/shop/ShopModalStep3';

import {
  Box,
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

import ShopModalStepWarenkorb from '@/components/kiosk/shop/ShopModalStep2Warenkorb';
import { useCart } from '@/providers/CardContext';
import { useStepper } from '@/providers/StepperContext';
import { useEffect } from 'react';
import { KISOK_BORDERRADIUS } from 'src/constants';

function StepperChoose({ steps }) {
  const { activeStep, setActiveStep } = useStepper();
  const { removeLastFromCart } = useCart();

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleStepClick = (index) => {
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
              active={<StepNumber />}
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

export function WarenkorbModal({ isOpen, onClose }) {
  const steps = [{ title: 'Warenkorb' }, { title: 'Bezahlvorgang' }];

  const { activeStep, setActiveStep } = useStepper();

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0);
    }
  }, [isOpen, setActiveStep]);

  const { payment } = useCart();

  const bgColorModal = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode'
  );

  return (
    <Modal
      variant='kiosk'
      isOpen={isOpen}
      onClose={payment != 'init' ? null : onClose}
    >
      <ModalOverlay />

      <ModalContent
        maxW='80%'
        height='90%'
        minH='90%'
        maxH='90%'
        //height='90%'
        m='auto'
        pt='4'
        pb='5'
        px='10'
        //bgColor={bgColorModal}
        borderRadius={KISOK_BORDERRADIUS}
      >
        <ModalHeader pb='2' width='95%'>
          {/* <StepperChoose steps={steps} /> */}

          <ModalCloseButton
            pr='5'
            pt='7'
            fontSize='2xl'
            _active={{ bgColor: 'transparent' }}
            _focus={{ bgColor: 'transparent' }}
            _hover={{ bgColor: 'transparent' }}
            isDisabled={payment != 'init'}
          />
        </ModalHeader>

        {activeStep === 0 && (
          <ShopModalStepWarenkorb // Warenkorb
            onClose={onClose}
          />
        )}
        {activeStep === 1 && (
          <ShopModalStep3 // Bezahlvorgang
            herkunft='warenkorb'
            onClose={onClose}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
