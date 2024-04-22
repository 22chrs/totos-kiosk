import { Box, Button, HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { ArrowIcon, CircleInfoRegular, RobotRegular } from '../icons/icons';

export const InfoCircle = () => {
  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      p='10'
      //bgColor='red'
      position='fixed'
      borderRadius='10rem' // Add this property to create round corners
      right={useColorModeValue('2.3vw', '2.5vw')}
      top={useColorModeValue('2vh', '3vh')}
      //transform='translateX(-50%)'
    >
      <Icon
        p={useColorModeValue('2', '0')}
        as={CircleInfoRegular}
        bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.3)')}
        fontSize={useColorModeValue('7rem', '6rem')}
        display='flex' // Add this property for centering the text
        alignItems='center' // Add this property for centering the text
        justifyContent='center' // Add this property for centering the text
        borderRadius='10rem' // Add this property to create round corners
      >
        Touch me.
      </Icon>
    </Box>
  );
};

export const Start = () => {
  return (
    <Box
      p='10'
      bgColor='red'
      //bgColor='red'
      position='fixed'
      borderRadius='10rem' // Add this property to create round corners
      bottom={useColorModeValue('2vh', '3vh')}
      //transform='translateX(-50%)'
    >
      <HStack>
        <Icon
          p={useColorModeValue('2', '0')}
          as={RobotRegular}
          fontSize={useColorModeValue('7rem', '6rem')}
          display='flex' // Add this property for centering the text
          alignItems='center' // Add this property for centering the text
          justifyContent='center' // Add this property for centering the text
          borderRadius='10rem' // Add this property to create round corners
        />
        <Icon
          p={useColorModeValue('2', '0')}
          as={ArrowIcon}
          fontSize={useColorModeValue('7rem', '6rem')}
          display='flex' // Add this property for centering the text
          alignItems='center' // Add this property for centering the text
          justifyContent='center' // Add this property for centering the text
          borderRadius='10rem' // Add this property to create round corners
        />
      </HStack>
    </Box>
  );
};
