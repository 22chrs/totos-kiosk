import { Button } from '@chakra-ui/react';

export const RedBox = () => {
  return (
    <Button
      position='fixed'
      left='50%' // Add this property to center horizontally
      bottom='12vh'
      transform='translateX(-50%)' // Add this property to center horizontally
      width='50vw'
      height='20%'
      bg='red'
      borderRadius='2rem' // Add this property to create round corners
      display='flex' // Add this property for centering the text
      alignItems='center' // Add this property for centering the text
      justifyContent='center' // Add this property for centering the text
    >
      Touch to start
    </Button>
  );
};
