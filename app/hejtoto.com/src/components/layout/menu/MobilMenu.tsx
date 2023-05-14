import {
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
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
    <Box>
      <Button
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

      <Modal size='xs' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay
          bg='blackAlpha.100'
          backdropFilter='blur(12px)'
          //backdropInvert='60%'
          //backdropBlur='2px'
        />
        <ModalContent
          border='2px'
          borderColor={useColorModeValue(
            'fontColor.lightMode',
            'fontColor.darkMode'
          )}
          borderRadius='0'
          px='0'
          pt='12'
          pb='15'
          bgColor={useColorModeValue(
            'footerBGColor.lightMode',
            'footerBGColor.darkMode'
          )}
          //bgColor='red'
        >
          {/* <ModalCloseButton pt='5' pr='4' /> */}
          <ModalBody textAlign='center'>
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

              <ModalHeader px='0' pt='15' pb='2'>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MobilMenu;
