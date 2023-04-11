import { Box, Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';

export const GridTextImage = ({ child1, child2, pt, pb }) => {
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
    lg: false,
    xl: false,
  });

  const isSmallNotebook = useBreakpointValue({
    base: false,
    sm: false,
    md: false,
    lg: true,
    xl: false,
  });

  return (
    <Grid
      pt={pt}
      pb={pb}
      w='100%'
      maxW='100%'
      px={
        isMobil ? '5vw' : isTablet ? '10vw' : isSmallNotebook ? '5vw' : '14vw'
      }
      templateRows='repeat(1, 1fr)' // Y
      templateColumns='repeat(9, 1fr)' // X
      gap={isMobil ? '0' : isTablet ? '0' : isSmallNotebook ? '10' : '15'}
    >
      <GridItem // TEXT
        rowSpan={1}
        colSpan={{
          base: 9,
          sm: 9,
          md: 9,
          lg: 3,
          xl: 3,
        }}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Box
          pb={
            isMobil ? '4vh' : isTablet ? '5vh' : isSmallNotebook ? '5%' : '5%'
          }
        >
          {child1}
        </Box>
      </GridItem>

      <GridItem // IMAGE
        rowSpan={1}
        colSpan={{
          base: 9,
          sm: 9,
          md: 9,
          lg: 6,
          xl: 6,
        }}
        display='flex'
        justifyContent={
          isMobil
            ? 'center'
            : isTablet
            ? 'center'
            : isSmallNotebook
            ? 'flex-end'
            : 'flex-end'
        }
        alignItems='center'
      >
        {child2}
      </GridItem>
    </Grid>
  );
};

export const GridImageText = ({ child1, child2, pt, pb }) => {
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
    lg: false,
    xl: false,
  });

  const isSmallNotebook = useBreakpointValue({
    base: false,
    sm: false,
    md: false,
    lg: true,
    xl: false,
  });

  return (
    <Grid
      pt={pt}
      pb={pb}
      w='100%'
      maxW='100%'
      px={
        isMobil ? '5vw' : isTablet ? '10vw' : isSmallNotebook ? '5vw' : '14vw'
      }
      templateRows='repeat(1, 1fr)' // Y
      templateColumns='repeat(9, 1fr)' // X
      gap={isMobil ? '0' : isTablet ? '0' : isSmallNotebook ? '10' : '15'}
    >
      <GridItem // IMAGE
        order={isMobil ? '2' : isTablet ? '2' : isSmallNotebook ? '1' : '1'}
        rowSpan={1}
        colSpan={{
          base: 9,
          sm: 9,
          md: 9,
          lg: 6,
          xl: 6,
        }}
        display='flex'
        justifyContent={
          isMobil
            ? 'center'
            : isTablet
            ? 'center'
            : isSmallNotebook
            ? 'flex-start'
            : 'flex-start'
        }
        alignItems='center'
      >
        {child2}
      </GridItem>

      <GridItem // TEXT
        order={isMobil ? '1' : isTablet ? '1' : isSmallNotebook ? '2' : '2'}
        rowSpan={1}
        colSpan={{
          base: 9,
          sm: 9,
          md: 9,
          lg: 3,
          xl: 3,
        }}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Box
          pb={
            isMobil ? '4vh' : isTablet ? '5vh' : isSmallNotebook ? '5%' : '5%'
          }
        >
          {child1}
        </Box>
      </GridItem>
    </Grid>
  );
};
