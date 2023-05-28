// Shop. tsx

import { ModalProductCard } from '@/components/kiosk/shop/ShopModal';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Grid,
  HStack,
  Heading,
  Spacer,
  Stack,
  VStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KIOSK_CATEGORY_WIDTH,
  KIOSK_CONTENT_HEIGHT,
  KISOK_BORDERRADIUS,
} from 'src/constants';

import {
  Category,
  Product,
  VerticalTabsProps,
} from '@/components/kiosk/shop/Interface';
import { handleUmlauts } from '@/components/kiosk/shop/utils';

// Kategorien
function Categories({ title, isSelected, onClick }) {
  const bgColor = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode'
  );

  const bgColorSelected = useColorModeValue(
    'footerBGColor.darkMode',
    'footerBGColor.lightMode'
  );
  const borderColor = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode'
  );

  const color = useColorModeValue(
    'primaryHeadingColor.lightMode',
    'primaryHeadingColor.darkMode'
  );
  const colorSelected = useColorModeValue(
    'primaryHeadingColor.darkMode',
    'primaryHeadingColor.lightMode'
  );

  const borderColorSelected = useColorModeValue('transparent', 'transparent');

  return (
    <Box
      zIndex={10}
      //shadow={useColorModeValue('md', 'xl')}
      borderWidth={3}
      borderRadius={isSelected ? KISOK_BORDERRADIUS : KISOK_BORDERRADIUS}
      cursor='pointer'
      bg={isSelected ? bgColorSelected : bgColor}
      borderColor={isSelected ? borderColorSelected : borderColor}
      color={isSelected ? colorSelected : color}
      onClick={onClick}
      textAlign='left' // Align the text to the left
      overflow='hidden'
      width={isSelected ? '100%' : '100%'} // ausufern
    >
      <HStack>
        <Box height='100vh' width='300' overflow='hidden' position='relative'>
          <Heading
            position='absolute'
            p='6'
            color={isSelected ? colorSelected : color}
            variant='h2_Kiosk'
          >
            {title}
          </Heading>
          <Box pl='50'>
            <Image
              src={`/kiosk/products/images/${handleUmlauts(title)}.png`}
              width={160}
              height={300}
              alt={title}
              quality={90}
            />
          </Box>
        </Box>
      </HStack>
    </Box>
  );
}

type MainProps = {
  products: Product[];
  formatPrice: (price: number) => string;
  category: Category;
};

const Main: React.FC<MainProps> = ({ category, products, formatPrice }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const cardBGColor = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode'
  );
  const cardFontColor = useColorModeValue(
    'primaryFontColor.lightMode',
    'primaryFontColor.darkMode'
  );

  const shadowCard = useColorModeValue('md', 'xl');

  const handleOpen = (product: Product, category: Category) => {
    setSelectedProduct(product);
    setSelectedCategory(category);
    onOpen();
  };

  const numRows = Math.ceil(products.length / 3);

  return (
    <Grid
      templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
      gap={5}
      pr='5'
      height='100%'
    >
      {products.map((product) => (
        <Card
          onClick={() => handleOpen(product, category)}
          key={product.name}
          borderRadius={KISOK_BORDERRADIUS}
          color={cardFontColor}
          height={numRows > 1 ? '100%' : 'calc(50% - 1.25rem / 2)'}
          position='relative'
          overflow='hidden'
          cursor='pointer'
        >
          <Image
            alt={`${product.name}`}
            fill={true}
            object-fit='contain'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            style={{ objectFit: 'cover' }}
            src={`/kiosk/products/images/${handleUmlauts(product.name)}.jpg`}
          />

          <CardBody zIndex='5'>
            <Flex width='100%' justifyContent='flex-start' pt='1' pl='2'>
              <Box pt='0'>
                <Box
                  //borderWidth='0.2rem'
                  // borderColor={useColorModeValue(
                  //   'primaryHeadingColor.lightMode',
                  //   'primaryHeadingColor.lightMode'
                  // )}
                  // bgColor={useColorModeValue(
                  //   'footerBGColor.lightMode',
                  //   'footerBGColor.lightMode'
                  // )}
                  pt='1'
                  pb='1.5'
                  pr='4'
                  pl='2'
                  roundedRight='lg'
                  //transform='translateX(-2rem)'
                >
                  <Heading
                    // color={useColorModeValue(
                    //   'primaryHeadingColor.lightMode',
                    //   'primaryHeadingColor.lightMode'
                    // )}
                    variant='h2_Kiosk'
                    color={cardFontColor}
                  >
                    {product.name}
                  </Heading>
                </Box>
              </Box>
            </Flex>
          </CardBody>

          <CardFooter zIndex='10'>
            <Flex width='100%' justifyContent='flex-end' pt='1' pr='2'>
              <Button variant='kiosk_pricetag_small' color={cardFontColor}>
                {formatPrice(product.price)}
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      ))}

      <ModalProductCard
        isOpen={isOpen}
        onClose={onClose}
        selectedProduct={selectedProduct}
        selectedCategory={selectedCategory}
        formatPrice={formatPrice}
      />
    </Grid>
  );
};

// SHOP
export const Shop: React.FC<VerticalTabsProps> = ({
  data,
  country,
  currency,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  // Format the price
  const formatPrice = (price: number) =>
    new Intl.NumberFormat(country, { style: 'currency', currency }).format(
      price
    );

  const { i18n } = useTranslation();
  return (
    <Flex>
      <VStack
        mr={selectedTab !== -1 ? '-1px' : '0'}
        spacing={5}
        align='start'
        pt={5}
        pb={0}
        pl={5}
        pr={5}
        height={KIOSK_CONTENT_HEIGHT}
        //height='100vh'
        overflowY='auto'
        width={KIOSK_CATEGORY_WIDTH}
        bgColor={useColorModeValue(
          'pageBGColor.lightMode',
          'pageBGColor.darkMode'
        )}
        color={useColorModeValue(
          'kioskBGColor.lightMode',
          'kioskBGColor.darkMode'
        )}
      >
        {data.map((category, index) => (
          <Categories
            key={category.name}
            title={category.name}
            isSelected={selectedTab === index}
            onClick={() => setSelectedTab(index)}
          />
        ))}
        <Spacer />
      </VStack>

      <Stack
        // MAIN PAGE SECTION
        pt={5}
        pl={0}
        pr={0}
        pb={5}
        overflowY='auto'
        css={{
          width: `calc(100vw - ${KIOSK_CATEGORY_WIDTH})`,
        }}
        height={KIOSK_CONTENT_HEIGHT}
        bgColor={useColorModeValue(
          'pageBGColor.lightMode',
          'pageBGColor.darkMode'
        )}
        color={useColorModeValue(
          'primaryFontColor.lightMode',
          'primaryFontColor.darkMode'
        )}
      >
        <Main
          products={data[selectedTab].products}
          formatPrice={formatPrice}
          category={data[selectedTab]}
        />
      </Stack>
    </Flex>
  );
};
