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
  Icon,
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
  KIOSK_PRODUCT_HEIGHT,
  KISOK_BORDERRADIUS,
} from 'src/constants';

import {
  Category,
  Product,
  VerticalTabsProps,
} from '@/components/kiosk/shop/Interface';
import { handleUmlauts } from '@/components/kiosk/shop/utils';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Kategorien
function Categories({ title, isSelected, onClick }) {
  const bgColor = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode',
  );

  const bgColorSelected = useColorModeValue(
    'footerBGColor.darkMode',
    'footerBGColor.lightMode',
  );
  const borderColor = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode',
  );

  const color = useColorModeValue(
    'primaryHeadingColor.lightMode',
    'primaryHeadingColor.darkMode',
  );
  const colorSelected = useColorModeValue(
    'primaryHeadingColor.darkMode',
    'primaryHeadingColor.lightMode',
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
        <Box height='100vh' overflow='hidden' position='relative'>
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
              //quality={90}
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
    null,
  );
  const [productIndex, setProductIndex] = useState(0); // State to track the index of the current product slice

  const handleOpen = (product: Product, category: Category) => {
    setSelectedProduct(product);
    setSelectedCategory(category);
    onOpen();
  };

  const handleNext = () => {
    const nextIndex = productIndex + 5;
    if (nextIndex >= products.length) {
      setProductIndex(0); // If at the end, loop back to the start
    } else {
      setProductIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = productIndex - 5;
    if (prevIndex < 0) {
      setProductIndex(Math.max(0, products.length - 5));
    } else {
      setProductIndex(prevIndex);
    }
  };

  const handleReset = () => {
    setProductIndex(0); // Resets to the beginning of the list
  };

  const cardBGColor = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode',
  );
  const cardFontColor = useColorModeValue(
    'primaryFontColor.lightMode',
    'primaryFontColor.darkMode',
  );

  const displayedProducts = products.slice(productIndex, productIndex + 5);
  const showMoreIndicator = products.length > productIndex + 5;
  const showPrevIndicator = productIndex > 0;
  const atEndOfList = productIndex + 5 >= products.length;

  return (
    <Grid
      templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
      gap={3}
      pr='0'
      height='100%'
    >
      {displayedProducts.map((product) => (
        <Card
          onClick={() => handleOpen(product, category)}
          key={product.name}
          borderRadius={KISOK_BORDERRADIUS}
          color={cardFontColor}
          height={KIOSK_PRODUCT_HEIGHT}
          position='relative'
          overflow='hidden'
          cursor='pointer'
        >
          <Image
            alt={`${product.name}`}
            fill={true}
            objectFit='contain'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            style={{ objectFit: 'cover' }}
            src={`/kiosk/products/images/${handleUmlauts(product.name)}.jpg`}
          />

          <CardBody zIndex='5' p='0'>
            <Flex width='100%' pl='2' pt='2' justifyContent='flex-start'>
              <Box py='1.5' px='2' rounded='lg'>
                <Heading variant='h2_Kiosk' color={cardFontColor}>
                  {product.name}
                </Heading>
              </Box>
            </Flex>
          </CardBody>

          <CardFooter
            zIndex='10'
            pb='3'
            pr='3'
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '100%',
            }}
          >
            <Flex width='100%' justifyContent='flex-end'>
              <Button variant='kiosk_pricetag_small' color={cardFontColor}>
                {formatPrice(product.price)}
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      ))}

      <Flex justifyContent='space-between' width='100%'>
        {showPrevIndicator && (
          <Icon
            as={FaChevronUp}
            w={8}
            h={8}
            cursor='pointer'
            onClick={handlePrev}
          />
        )}
        {showMoreIndicator ? (
          <Icon
            as={FaChevronDown}
            w={8}
            h={8}
            cursor='pointer'
            onClick={handleNext}
          />
        ) : atEndOfList ? (
          <Icon
            as='feComponentTransfer'
            w={8}
            h={8}
            cursor='pointer'
            onClick={handleReset}
          />
        ) : null}
      </Flex>

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
      price,
    );

  const { i18n } = useTranslation();
  return (
    <Flex>
      <VStack
        mr={selectedTab !== -1 ? '-1px' : '0'}
        spacing={3}
        align='start'
        pt='3'
        pb='0'
        pl='3'
        pr='3'
        height={KIOSK_CONTENT_HEIGHT}
        //height='100vh'
        overflowY='auto'
        width={KIOSK_CATEGORY_WIDTH}
        bgColor={useColorModeValue(
          'pageBGColor.lightMode',
          'pageBGColor.darkMode',
        )}
        color={useColorModeValue(
          'kioskBGColor.lightMode',
          'kioskBGColor.darkMode',
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
        pt='3'
        pl='0'
        pr='3'
        pb='3'
        overflowY='auto'
        css={{
          width: `calc(100vw - ${KIOSK_CATEGORY_WIDTH})`,
        }}
        height={KIOSK_CONTENT_HEIGHT}
        bgColor={useColorModeValue(
          'pageBGColor.lightMode',
          'pageBGColor.darkMode',
        )}
        color={useColorModeValue(
          'primaryFontColor.lightMode',
          'primaryFontColor.darkMode',
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
