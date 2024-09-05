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
import {
  AnglesRightSolid,
  ArrowIcon,
  ChevronsRightSharpSolid,
  ArrowRightSharpSolid,
  XmarkSolid,
  ArrowUpSharpSolid,
} from '@/components/icons/icons';

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
      //shadow={useColorModeValue('md', 'xl')}
      borderWidth='0'
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
        <Box height='100vh' overflow='hidden' position='relative' zIndex='5'>
          {/* Wrap the image and heading in a container to overlap */}
          <Box
            width='500px'
            height='500px'
            position='relative'
            overflow='hidden'
          >
            <Box
              position='absolute' // Make the heading absolutely positioned
              top='0' // Align it to the top of the image (adjust as needed)
              left='0' // Align to the left of the image
              p='3'
              zIndex='10'
            >
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
                  {/* This is for when isSelected is true */}
                </Box>
              ) : (
                <Box position='absolute' top='100%' left='10%' zIndex='10'>
                  <Icon
                    fontSize='4rem'
                    as={ArrowUpSharpSolid}
                    color='primaryHeadingColor.darkMode'
                  />
                  {/* This is for when isSelected is false */}
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
                //transform: 'scale(2.2)', // Zoom in by 2.5x
                transformOrigin: '50% 110%', // Adjust the focus
                objectFit: 'cover',
              }}
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
    // If the next index exceeds the length of the products, reset to the beginning
    if (nextIndex >= products.length) {
      setProductIndex(0); // Start from the beginning
    } else {
      setProductIndex(nextIndex); // Otherwise, move to the next set
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
      gap='3'
      p='0'
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

      <Flex justifyContent='center' alignItems='center'>
        {products.length > 5 && (
          <Button gap='5' variant='kiosk_rainbow_big' onClick={handleNext}>
            Weitere
            <Icon boxSize='2.5rem' as={ChevronsRightSharpSolid} />
          </Button>
        )}
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
            onClick={() => setSelectedTab(index)} // Simply update the selected category
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
        {/* The key prop ensures a re-render, resetting the state */}
        <Main
          key={selectedTab} // This will reset the component when a new category is selected
          products={data[selectedTab].products}
          formatPrice={formatPrice}
          category={data[selectedTab]}
        />
      </Stack>
    </Flex>
  );
};
