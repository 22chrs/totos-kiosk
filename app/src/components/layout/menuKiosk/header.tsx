import { useRouter } from '@/providers/DisplayContext';
import { Box, Grid, GridItem, HStack, useColorMode } from '@chakra-ui/react';

import { PaymentImages } from '@/components/images/PaymentImages';
import LogoUniversalKiosk from '@/components/logo/LogoUniversalKiosk';

// 5 |20-50-20| 5
export const HeaderStartPage = () => {
  const router = useRouter();
  const handlePageClick = () => {
    router.pushWithDisplay('./kiosk/shop');
  };

  const { toggleColorMode } = useColorMode();
  return (
    <Box
      px='5vw'
      w='100%'
      maxW='100%'
      position='absolute'
      onClick={handlePageClick}
    >
      <Grid
        templateColumns='repeat(7, 1fr)'
        templateRows='repeat(1, 1fr)'
        pt='10vh'
        as='header'
      >
        <GridItem
          area={'headerLogo'}
          colSpan={1}
          rowSpan={1}
          w='20vw'
          //bgColor='red.100'
        >
          <Box
            onClick={(e) => {
              toggleColorMode();
              e.stopPropagation();
            }}
          >
            <LogoUniversalKiosk height={140} logoType='Logo' top='0' />
          </Box>
        </GridItem>

        <GridItem
          w='50vw'
          //bgColor='blue.100'
          area={'headerMenu'}
          colSpan={5}
          rowSpan={1}
          as='header'
        ></GridItem>

        <GridItem
          //bgColor='orange.100'
          w='17vw'
          area={'headerRight'}
          colSpan={1}
          rowSpan={1}
        >
          <PaymentImages />
          <HStack justify='right' spacing={5}></HStack>
        </GridItem>

        <GridItem area={'main'} colSpan={5} rowSpan={5}></GridItem>

        <GridItem colSpan={3}></GridItem>
      </Grid>
    </Box>
  );
};

// 5 |15-50-25| 5
export const HeaderMainPage = () => {
  return <></>;
};
