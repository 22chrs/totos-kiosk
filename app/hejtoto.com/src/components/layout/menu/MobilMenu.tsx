import {
  Button,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaHamburger } from 'react-icons/fa';

const MobilMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        px='0'
        onClick={onOpen}
        bgColor='transparent'
        _hover={{ bgColor: 'transparent' }}
      >
        <Icon
          _focusVisible={{
            outline: 'none',
          }}
          as={FaHamburger}
          fontSize='3xl'
          color={useColorModeValue('fontColor.lightMode', 'fontColor.darkMode')}
        />
      </Button>

      <Modal
        variant='toto'
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        autoFocus={false}
      >
        <ModalOverlay />
        <ModalContent px='0' minW='50%' w='auto' maxW='90%'>
          <ModalCloseButton pt='5' pr='4' />

          <VStack spacing={3} textAlign='left' align='left' px='20%'>
            <ModalHeader px='0' pb='2'>
              Unser Service
            </ModalHeader>
            <Link onClick={onClose} href='/service/barista'>
              Veranstaltung planen
            </Link>
            <Link onClick={onClose} href='/service/pricing'>
              Preise
            </Link>
            <Link onClick={onClose} href='/service/places'>
              Aufstellorte
            </Link>
            <Link onClick={onClose} href='/service/faqs'>
              FAQ
            </Link>

            <ModalHeader px='0' pt='10' pb='2'>
              Über uns
            </ModalHeader>
            <Link onClick={onClose} href='/about/about'>
              Toto & Team
            </Link>
            <Link onClick={onClose} href='/about/feedback'>
              Feedback
            </Link>
            <Link onClick={onClose} href='/about/sustainability'>
              Nachhaltigkeit
            </Link>
            <Link onClick={onClose} href='/about/faqs'>
              FAQ
            </Link>
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MobilMenu;
