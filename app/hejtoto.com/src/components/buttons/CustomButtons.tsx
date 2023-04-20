import { Button, Text, useColorModeValue } from '@chakra-ui/react';

export const ButtonLightFooter = ({ text }) => {
  return (
    <Button
      //as='button'
      size='md'
      //colorScheme='brand'
      variant='ghost'
      fontWeight={400}
      //border='1px'
      px='0px'
      h='0px'
      //color={useColorModeValue('brand.50', 'gray.600')}
      bg={useColorModeValue(
        'footerBGColor.lightMode',
        'footerBGColor.darkMode'
      )}
      color={useColorModeValue(
        'footerFontColor.lightMode',
        'footerFontColor.darkMode'
      )}
    >
      {text}
    </Button>
  );
};

export const ButtonText = ({ text }) => {
  return (
    <Text
      pt='0'
      className='myItem'
      sx={{
        '.myItem:hover &': {
          textDecoration: 'underline',
          textDecorationThickness: '0.08rem',
          textUnderlineOffset: '0.2rem',
        },
      }}
      variant='footer'
    >
      {text}
    </Text>
  );
};
