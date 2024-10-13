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
  Fade,
} from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
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

import {
  ChevronsRightSharpSolid,
  ArrowRightSharpSolid,
  ArrowUpSharpSolid,
} from '@/components/icons/icons';
import { t } from 'i18next';

// Type definitions for Categories component
interface CategoriesProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

// Memoized Categories Component with display name and type annotations
const Categories: React.FC<CategoriesProps> = React.memo(function Categories({
  title,
  isSelected,
  onClick,
}) {
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

  const borderColorSelected = useColorModeValue('transparent', 'transparent');

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
          {/* Wrap the image and heading in a container to overlap */}
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
                    ? 'kiosk_categoryTagAselected'
                    : 'kiosk_categoryTagAselected'
                }
              >
                {t(`${title}`)}
              </Button>
              {isSelected ? (
                <Box position='absolute' top='95%' left='0' pl='40' zIndex='10'>
                  <Icon
                    fontSize='8rem'
                    as={ArrowRightSharpSolid}
                    color='primaryHeadingColor.lightMode'
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
            {/* Image behind the heading */}
            <Image
              src={`/kiosk/products/images/${handleUmlauts(title)}.jpg`}
              width={500}
              height={500}
              alt={title}
              style={{
                transformOrigin: '50% 110%',
                objectFit: 'cover',
                opacity: 0.3,
              }}
            />
          </Box>
        </Box>
      </HStack>
    </Box>
  );
});

// Type definitions for ProductCard component
interface ProductCardProps {
  product: Product;
  category: Category;
  formatPrice: (price: number) => string;
  handleOpen: (product: Product, category: Category) => void;
}

// Memoized ProductCard Component with display name and type annotations
const ProductCard: React.FC<ProductCardProps> = React.memo(
  function ProductCard({ product, category, formatPrice, handleOpen }) {
    const [hasLoaded, setHasLoaded] = useState(false);
    const cardFontColor = useColorModeValue(
      'primaryFontColor.lightMode',
      'primaryFontColor.darkMode',
    );

    return (
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
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          style={{ objectFit: 'cover' }}
          src={`/kiosk/products/images/${handleUmlauts(product.name)}.jpg`}
          onLoad={() => setHasLoaded(true)}
        />

        <CardBody zIndex='5' p='0'>
          <Flex width='100%' pl='4' pt='4' justifyContent='flex-start'>
            <Button variant='kiosk_nametag'>{t(`${product.name}`)}</Button>
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
    );
  },
);

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
  const [productIndex, setProductIndex] = useState(0);

  // Reset productIndex when the category changes
  useEffect(() => {
    setProductIndex(0);
  }, [category]);

  const handleOpen = useCallback(
    (product: Product, category: Category) => {
      setSelectedProduct(product);
      setSelectedCategory(category);
      onOpen();
    },
    [onOpen],
  );

  const handleNext = () => {
    const nextIndex = productIndex + 5;
    if (nextIndex >= products.length) {
      setProductIndex(0);
    } else {
      setProductIndex(nextIndex);
    }
  };

  const displayedProducts =
    products.length > 6
      ? products.slice(productIndex, productIndex + 5)
      : products.slice(productIndex, productIndex + 6);

  return (
    <Grid
      templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
      gap='3'
      p='0'
      height='100%'
    >
      {displayedProducts.map((product) => (
        <ProductCard
          key={product.name}
          product={product}
          category={category}
          formatPrice={formatPrice}
          handleOpen={handleOpen}
        />
      ))}

      {products.length > 6 && (
        <Flex justifyContent='center' alignItems='center'>
          <Button gap='5' variant='kiosk_rainbow_big' onClick={handleNext}>
            Weitere
            <Icon boxSize='2.5rem' as={ChevronsRightSharpSolid} />
          </Button>
        </Flex>
      )}

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

// SHOP Component
export const Shop: React.FC<VerticalTabsProps> = ({
  data,
  country,
  currency,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Format the price
  const formatPrice = (price: number) =>
    new Intl.NumberFormat(country, { style: 'currency', currency }).format(
      price,
    );

  const { i18n } = useTranslation();

  return (
    <Fade
      in={true}
      transition={{ enter: { duration: 0.5, ease: 'easeInOut' } }}
    >
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
              onClick={() => setSelectedTab(index)}
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
          css={{
            width: `calc(100vw - ${KIOSK_CATEGORY_WIDTH})`,
          }}
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
            products={data[selectedTab].products}
            formatPrice={formatPrice}
            category={data[selectedTab]}
          />
        </Stack>
      </Flex>
    </Fade>
  );
};
