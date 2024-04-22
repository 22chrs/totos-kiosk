import { Button, useColorModeValue } from '@chakra-ui/react';

export const TouchToStart = () => {
  return (
    <Button
      bg={useColorModeValue('rgba(255, 255, 255, 0.15)', 'rgba(0, 0, 0, 0.3)')}
      position='fixed'
      left='50%' // Add this property to center horizontally
      bottom='20vh'
      transform='translateX(-50%)' // Add this property to center horizontally
      width='30vw'
      height='15vh'
      borderRadius='2rem' // Add this property to create round corners
      display='flex' // Add this property for centering the text
      alignItems='center' // Add this property for centering the text
      justifyContent='center' // Add this property for centering the text
    >
      Touch me.
    </Button>
  );
};
