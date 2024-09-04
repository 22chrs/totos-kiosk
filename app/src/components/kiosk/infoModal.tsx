// infoModal.tsx

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import LogoUniversalKiosk from '../logo/LogoUniversalKiosk';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal = ({ isOpen, onClose }: InfoModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant='kiosk'>
      <ModalOverlay />
      <ModalContent
        maxW='100%'
        height='100%'
        minH='100%'
        maxH='100%'
        m='0'
        p='0'
      >
        <ModalHeader py='10' pl='10'>
          <LogoUniversalKiosk height={100} logoType='Logo' top='0' />
        </ModalHeader>

        <ModalBody pl='10'>
          {/* Add content for your modal here */}
          <Text>
            This is the info modal that provides additional information about
            the kiosk.
          </Text>
        </ModalBody>

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
        />
      </ModalContent>
    </Modal>
  );
};

export default InfoModal;
