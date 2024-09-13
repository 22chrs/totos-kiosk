// ShopModal.tsx
import ShopModalStep0 from '@/components/kiosk/shop/ShopModalStep0';
import ShopModalStep1 from '@/components/kiosk/shop/ShopModalStep1';
import ShopModalStep3 from '@/components/kiosk/shop/ShopModalStep3';

import {
  Box,
  Button,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
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

import {
  CreditCardRegular,
  FaceSmileSharpRegular,
  XmarkSharpSolid,
} from '@/components/icons/icons';
import ShopModalStepWarenkorb from '@/components/kiosk/shop/ShopModalStep2Warenkorb';
import { useCart } from '@/providers/CardContext';
import { useStepper } from '@/providers/StepperContext';
import { useEffect, useState } from 'react';
import { KISOK_BORDERRADIUS } from 'src/constants';
import i18n, { standardSprache } from '@/internationalization/i18n';

import { useRouter } from '@/providers/DisplayContext';

function StepperChoose({ steps }) {
  const { activeStep, setActiveStep } = useStepper();
  const { removeLastFromCart, payment } = useCart();

  const handleStepClick = (index) => {
    if (payment != 'idle') return;

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State to control the confirm modal
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

  const router = useRouter();

  const { setPayment, payment, clearCart } = useCart();

  const handleCloseClick = () => {
    if (payment === 'processing') {
      setIsConfirmOpen(true); // Open the confirmation modal if processing
    } else if (payment === 'success') {
      clearCart();
      onClose();
      i18n.changeLanguage(standardSprache);
      router.pushWithDisplay('/');
      setPayment('idle');
    } else {
      onClose(); // Close the main modal immediately if not processing
    }
  };

  // Function to confirm closing during processing
  const handleConfirmClose = () => {
    setPayment('idle');
    setIsConfirmOpen(false); // Close the confirmation modal
    onClose(); // Close the main modal
  };

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

  const bgColorModal = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode',
  );

  return (
    <>
      {/* Main Modal */}
      <Modal
        variant='kiosk'
        isOpen={isOpen}
        onClose={handleCloseClick} // Handle close based on payment state
      >
        <ModalOverlay />
        <ModalContent
          maxW='100%'
          height='100%'
          minH='100%'
          maxH='100%'
          m='0'
          pt='0'
          pb='0'
          px='0'
          borderRadius={KISOK_BORDERRADIUS}
        >
          <ModalHeader pb='0' width='95%'>
            <ModalCloseButton
              pr='9'
              pt='11'
              fontSize='2xl'
              onClick={handleCloseClick} // Handle the click here
              _active={{ bgColor: 'transparent', borderColor: 'transparent' }}
              _focus={{
                outline: 'none',
                bgColor: 'transparent',
                borderColor: 'transparent',
              }}
              _hover={{ bgColor: 'transparent', borderColor: 'transparent' }}
            />
          </ModalHeader>

          {/* Your step rendering logic */}
          {activeStep === 0 && (
            <ShopModalStep0
              selectedProduct={selectedProduct}
              selectedCategory={selectedCategory}
              formatPrice={formatPrice}
            />
          )}
          {selectedCategory && selectedCategory.mugs && activeStep === 1 && (
            <ShopModalStep1
              selectedProduct={selectedProduct}
              selectedCategory={selectedCategory}
              formatPrice={formatPrice}
            />
          )}
          {activeStep === 2 && <ShopModalStepWarenkorb onClose={onClose} />}
          {activeStep === 3 && <ShopModalStep3 onClose={onClose} />}
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmCloseModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)} // Close the confirmation modal without closing the main modal
        onConfirm={handleConfirmClose} // Confirm and close the main modal
      />
    </>
  );
}

function ConfirmCloseModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal variant='kiosk' isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent minW='70%' minH='40%' maxH='50%' py='10' px='5'>
        <ModalHeader>
          <ModalCloseButton
            pr='5'
            pt='7'
            fontSize='2xl'
            onClick={onClose} // Handle the click here
            _active={{ bgColor: 'transparent', borderColor: 'transparent' }}
            _focus={{
              outline: 'none',
              bgColor: 'transparent',
              borderColor: 'transparent',
            }}
            _hover={{ bgColor: 'transparent', borderColor: 'transparent' }}
          />
          <Heading variant='h1_Kiosk'>Zahlvorgang abbrechen?</Heading>
        </ModalHeader>
        <ModalBody></ModalBody>

        <ModalFooter gap='10'>
          <Button
            gap='3'
            px='5'
            py='7'
            fontSize='3xl'
            variant='outline'
            colorScheme='red'
            onClick={onConfirm}
          >
            <Icon boxSize={10} as={XmarkSharpSolid} />
            Ja, Abbruch!
          </Button>

          <Button
            gap='5'
            px='5'
            py='7'
            fontSize='3xl'
            variant='solid'
            colorScheme='red'
            onClick={onClose}
          >
            <Icon boxSize={10} as={CreditCardRegular} />
            Nein, fortsetzen.
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
