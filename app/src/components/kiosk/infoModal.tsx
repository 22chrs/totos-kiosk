// InfoModal.tsx

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Text,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
} from '@chakra-ui/react';
import LogoUniversalKiosk from '../logo/LogoUniversalKiosk';
import { SliderWithTooltip, ActionButtons } from './ActionButtons';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  // State for the slider value
  const [sliderValue, setSliderValue] = React.useState<number>(50); // Default value set to 50

  // Handler for slider value change
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    console.log(`Slider value: ${value}%`);
    // Implement additional functionality based on slider value if needed
  };

  // Handler for the "Home" button
  const handleHomeClick = () => {
    console.log('Home button clicked');
    // Add your Home button functionality here
  };

  // Handler for the "Move" button
  const handleMoveClick = () => {
    console.log('Move button clicked');
    // Add your Move button functionality here
  };
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

        <ModalBody pl='10' pr='10'>
          <Tabs variant='enclosed'>
            <TabList gap='2'>
              <Tab>
                <Heading size='lg'>Doors</Heading>
              </Tab>
              <Tab>
                <Heading size='lg'>Lights</Heading>
              </Tab>
              <Tab>
                <Heading size='lg'>Front</Heading>
              </Tab>
              <Tab>
                <Heading size='lg'>Back</Heading>
              </Tab>
              <Tab>
                <Heading size='lg'>Service</Heading>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ActionButtons
                  showSlider={false}
                  heading='Front' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[{ label: 'open', onClick: handleMoveClick }]}
                  pt='5'
                />
                <ActionButtons
                  showSlider={false}
                  heading='Back' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[{ label: 'open', onClick: handleMoveClick }]}
                />
                <ActionButtons
                  showSlider={false}
                  heading='Service' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[{ label: 'open', onClick: handleMoveClick }]}
                />
              </TabPanel>
              <TabPanel>
                <ActionButtons
                  heading='Ceiling spots' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                  mt='8'
                />
              </TabPanel>
              <TabPanel>
                <ActionButtons
                  heading='Becherschubse' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                />
                <ActionButtons
                  heading='Schleuse' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                />
                <ActionButtons
                  heading='Shield' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                />
                <ActionButtons
                  pt='10'
                  heading='Snackbar' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                />
              </TabPanel>
              <TabPanel>4</TabPanel>
              <TabPanel>
                <ActionButtons
                  heading='Lift A' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                  pt='5'
                />
                <ActionButtons
                  heading='Rodell A' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                  pb='5'
                />

                <ActionButtons
                  heading='Lift B' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                />
                <ActionButtons
                  heading='Rodell B' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                  pb='5'
                />

                <ActionButtons
                  heading='Lift C' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                />
                <ActionButtons
                  heading='Rodell C' // Custom heading
                  customComponent={
                    <SliderWithTooltip
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      colorScheme='teal'
                    />
                  }
                  buttons={[
                    { label: 'update', onClick: handleMoveClick },
                    { label: 'off', onClick: handleHomeClick },
                  ]}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
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
