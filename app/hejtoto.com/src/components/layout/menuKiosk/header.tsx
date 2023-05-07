import { MagicLink } from '@/components/links/CustomLink';
import { Box, Grid, GridItem, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';

import { LanguagesButtonNackt } from '@/components/buttons/LanguageButton';
import LogoUniversal from '@/components/logo/LogoUniversal';

// 5 |15-50-25| 5
const Header = () => {
  return (
    <Box px='5vw' w='100%' maxW='100%' position='absolute'>
      <Grid
        templateColumns='repeat(7, 1fr)'
        templateRows='repeat(1, 1fr)'
        pt='6vh'
        as='header'
      >
        <GridItem
          area={'headerLogo'}
          colSpan={1}
          rowSpan={1}
          w='15vw'
          //bgColor='red.100'
        >
          <MagicLink href='/' as={NextLink} style={{ textDecoration: 'none' }}>
            <LogoUniversal height={55} logoType='Logo' top='0' />
          </MagicLink>
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

          w='25vw'
          area={'headerRight'}
          colSpan={1}
          rowSpan={1}
        >
          <HStack justify='right' spacing={5}>
            <LanguagesButtonNackt />
          </HStack>
        </GridItem>

        <GridItem area={'main'} colSpan={5} rowSpan={5}></GridItem>

        <GridItem colSpan={3}></GridItem>
      </Grid>
    </Box>
  );
};

export default Header;
