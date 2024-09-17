// Shop.tsx

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
  Icon,
  Spacer,
  Stack,
  VStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState, useCallback, useMemo } from 'react';
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
import {
  ArrowRightSharpSolid,
  ArrowUpSharpSolid,
  ChevronsRightSharpSolid,
} from '@/components/icons/icons';
import { useStepper } from '@/providers/StepperContext';

// Memoized Categories Component
const Categories: React.FC<{
  title: string;
  isSelected: boolean;
  onClick: () => void;
}> = React.memo(function Categories({ title, isSelected, onClick }) {
  const bgColor = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode',
  );

  const bgColorSelected = useColorModeValue(
    'footerBGColor.darkMode',
    'footerBGColor.lightMode',
  );
  const borderColor = useColorModeValue(
    'footerBGColor.darkMode',
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

  const borderColorSelected = 'transparent';

  return (
    <Box
      zIndex={10}
      borderWidth='0'
      borderRadius={KISOK_BORDERRADIUS}
      cursor='pointer'
      bg={isSelected ? bgColorSelected : bgColor}
      borderColor={isSelected ? borderColorSelected : borderColor}
      color={isSelected ? colorSelected : color}
      onClick={onClick}
      textAlign='left'
      overflow='hidden'
      width='100%'
    >
      <HStack>
        <Box height='100vh' overflow='hidden' position='relative' zIndex='5'>
          <Box
            width='500px'
            height='500px'
            position='relative'
            overflow='hidden'
          >
            <Box position='absolute' top='0' left='0' p='3' zIndex='10'>
              <Button
                variant={
                  isSelected
                    ? 'kiosk_categoryTagSelected'
                    : 'kiosk_categoryTagAselected'
                }
              >
                {title}
              </Button>
              {isSelected ? (
                <Box position='absolute' top='95%' left='0' pl='40' zIndex='10'>
                  <Icon
                    fontSize='8rem'
                    as={ArrowRightSharpSolid}
                    color='primaryHeadingColor.darkMode'
                  />
                </Box>
              ) : (
                <Box position='absolute' top='100%' left='10%' zIndex='10'>
                  <Icon
                    fontSize='4rem'
                    as={ArrowUpSharpSolid}
                    color='primaryHeadingColor.darkMode'
                  />
                </Box>
              )}
            </Box>
            <Image
              src={`/kiosk/products/images/${handleUmlauts(title)}.jpg`}
              width={500}
              height={500}
              alt={title}
              style={{
                transformOrigin: '50% 110%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Box>
      </HStack>
    </Box>
  );
});

type MainProps = {
  products: Product[];
  formatPrice: (price: number) => string;
  category: Category;
};

const MainComponent: React.FC<MainProps> = ({
  category,
  products,
  formatPrice,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [productIndex, setProductIndex] = useState(0);

  const { setActiveStep } = useStepper();

  const handleOpen = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      setSelectedCategory(category);
      setActiveStep(0); // Reset the activeStep to 0 when opening the modal
      onOpen();
    },
    [category, onOpen, setActiveStep],
  );

  const handleNext = useCallback(() => {
    setProductIndex((prevIndex) => {
      const nextIndex = prevIndex + 5;
      return nextIndex >= products.length ? 0 : nextIndex;
    });
  }, [products.length]);

  const cardFontColor = useColorModeValue(
    'primaryFontColor.lightMode',
    'primaryFontColor.darkMode',
  );

  const displayedProducts = useMemo(
    () => products.slice(productIndex, productIndex + 5),
    [products, productIndex],
  );

  return (
    <Grid
      templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
      gap='3'
      p='0'
      height='100%'
    >
      {displayedProducts.map((product) => (
        <Card
          onClick={() => handleOpen(product)}
          key={product.name}
          borderRadius={KISOK_BORDERRADIUS}
          color={cardFontColor}
          height={KIOSK_PRODUCT_HEIGHT}
          position='relative'
          overflow='hidden'
          cursor='pointer'
        >
          <Image
            alt={product.name}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            style={{ objectFit: 'cover' }}
            src={`/kiosk/products/images/${handleUmlauts(product.name)}.jpg`}
          />

          <CardBody zIndex='5' p='0'>
            <Flex width='100%' pl='4' pt='4' justifyContent='flex-start'>
              <Button variant='kiosk_nametag'>{product.name}</Button>
            </Flex>
          </CardBody>

          <CardFooter
            zIndex='10'
            pb='3'
            pr='3'
            position='absolute'
            bottom='0'
            right='0'
            width='100%'
          >
            <Flex width='100%' justifyContent='flex-end'>
              <Button variant='kiosk_pricetag_small' color={cardFontColor}>
                {formatPrice(product.price)}
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      ))}

      {products.length > 5 && (
        <Flex justifyContent='center' alignItems='center'>
          <Button gap='5' variant='kiosk_rainbow_big' onClick={handleNext}>
            Weitere
            <Icon boxSize='2.5rem' as={ChevronsRightSharpSolid} />
          </Button>
        </Flex>
      )}

      {selectedProduct && selectedCategory && (
        <ModalProductCard
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedProduct(null);
            setSelectedCategory(null);
          }}
          selectedProduct={selectedProduct}
          selectedCategory={selectedCategory}
          formatPrice={formatPrice}
        />
      )}
    </Grid>
  );
};

// Wrap MainComponent with React.memo
const Main = React.memo(MainComponent);

// SHOP
export const Shop: React.FC<VerticalTabsProps> = ({
  data,
  country,
  currency,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Memoize the price formatter
  const priceFormatter = useMemo(
    () => new Intl.NumberFormat(country, { style: 'currency', currency }),
    [country, currency],
  );

  const formatPrice = useCallback(
    (price: number) => priceFormatter.format(price),
    [priceFormatter],
  );

  const handleCategoryClick = useCallback((index: number) => {
    setSelectedTab(index);
  }, []);

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
        overflowY='auto'
        width={KIOSK_CATEGORY_WIDTH}
        bgColor={useColorModeValue(
          'footerBGColor.lightMode',
          'footerBGColor.darkMode',
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
            onClick={() => handleCategoryClick(index)}
          />
        ))}
        <Spacer />
      </VStack>

      <Stack
        pt='3'
        pl='0'
        pr='3'
        pb='3'
        overflowY='auto'
        width={`calc(100vw - ${KIOSK_CATEGORY_WIDTH})`}
        height={KIOSK_CONTENT_HEIGHT}
        bgColor={useColorModeValue(
          'footerBGColor.lightMode',
          'footerBGColor.darkMode',
        )}
        color={useColorModeValue(
          'primaryFontColor.lightMode',
          'primaryFontColor.darkMode',
        )}
      >
        <Main
          key={selectedTab}
          products={data[selectedTab].products}
          formatPrice={formatPrice}
          category={data[selectedTab]}
        />
      </Stack>
    </Flex>
  );
};

export default Shop;
