import {
  Box,
  Heading,
  HStack,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';

export const StandardPage = ({ children, heading }) => {
  const isMobil = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
    xl: false,
  });
  const isTablet = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
    lg: true,
    xl: false,
  });
  return (
    <Box w='100%'>
      <Box pt='20vh'></Box>
      <Stack
        px={isMobil ? '5vw' : isTablet ? '5vw' : '15vw'}
        //bgColor='red.100'
        //spacing={20}
        //py={12}
        //align='center'
        //h='80vh'
        maxW='100vw'
        //direction={{ base: 'column', md: 'row' }}
      >
        <HStack align='left' justify='left'>
          <Heading pb='15' variant='h1'>
            {heading}
          </Heading>
        </HStack>
        <Box pb='10vh' px='0'>
          {children}
        </Box>
      </Stack>
    </Box>
  );
};
