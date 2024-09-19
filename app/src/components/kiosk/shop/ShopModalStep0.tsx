// ShopModalStep0.tsx

import React from 'react';
import Image from 'next/image';
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  ModalBody,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { RxCube } from 'react-icons/rx';
import { BanRegular, ArrowRightSharpSolid } from '@/components/icons/icons';
import { useCart } from '@/providers/CardContext';
import { useStepper } from '@/providers/StepperContext';
import { KIOSK_HEIGHTCONTENT_MODAL, KISOK_BORDERRADIUS } from 'src/constants';
import { handleUmlauts } from './utils';
import { Product, Category } from '@/components/kiosk/shop/Interface';

type SugarLevel = 'zero' | 's' | 'm' | 'l';

interface ShopModalStep0Props {
  selectedProduct: Product;
  selectedCategory: Category;
  formatPrice: (price: number) => string;
}

function ShopModalStep0({
  selectedProduct,
  selectedCategory,
  formatPrice,
}: ShopModalStep0Props) {
  const sugarLevels: SugarLevel[] = ['zero', 's', 'm', 'l'];

  const {
    setActiveStep,
    selectedSizeOption,
    setSelectedSizeOption,
    selectedSugarOption,
    setSelectedSugarOption,
  } = useStepper();

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const calculatedPrice =
      selectedProduct.price +
      (selectedSizeOption ? selectedSizeOption.additionalCost : 0);

    const productCart = {
      product: selectedProduct,
      productCategory: selectedCategory.name,
      calculatedPrice,
      vat: selectedProduct.vat,
      choosenSize: selectedSizeOption ? selectedSizeOption.size : null,
      choosenSugar: selectedSugarOption,
      choosenMug: null,
      choosenLid: null,
      quantity: 1,
    };

    addToCart(productCart);
  };

  // Ensure that selectedSizeOption is available before rendering
  if (
    !selectedSizeOption &&
    selectedProduct.sizes &&
    selectedProduct.sizes.length > 0
  ) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <ModalBody>
      <Flex direction='column' height='100%'>
        <HStack spacing='10' alignItems='flex-start'>
          {/* Product Image */}
          <Box pt='0'>
            <Box
              borderRadius={KISOK_BORDERRADIUS}
              minH={KIOSK_HEIGHTCONTENT_MODAL}
              minW={`calc(${KIOSK_HEIGHTCONTENT_MODAL} * 0.75)`}
              position='relative'
              overflow='hidden'
            >
              <Image
                alt={selectedProduct.name}
                fill
                sizes='(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw'
                style={{ objectFit: 'cover' }}
                src={`/kiosk/products/images/${handleUmlauts(
                  selectedProduct.name,
                )}.jpg`}
              />
              {/* Emblems */}
              <Box position='absolute' bottom='5' left='8' zIndex='10'>
                <VStack gap='8'>
                  {selectedProduct.glutenfree && (
                    <Image
                      src='/assets/icons/glutenfree.svg'
                      alt='Gluten Free'
                      width={95}
                      height={95}
                    />
                  )}
                  {selectedProduct.vegan && (
                    <Image
                      src='/assets/icons/vegan.svg'
                      alt='Vegan'
                      width={90}
                      height={90}
                    />
                  )}
                </VStack>
              </Box>
            </Box>
          </Box>
          {/* Product Details */}
          <VStack
            w='100%'
            alignItems='flex-start'
            spacing='0'
            height={KIOSK_HEIGHTCONTENT_MODAL}
          >
            <Box>
              <Box maxW='93%'>
                <Heading py='0' variant='h1_Kiosk'>
                  {selectedProduct.name}
                </Heading>
                <HStack>
                  <Icon
                    pr='0.1rem'
                    boxSize='1.2rem'
                    as={HiOutlineMagnifyingGlass}
                  />
                  <Text as='u' pt='0' fontSize='xl'>
                    Allergene und Produktinformationen
                  </Text>
                </HStack>
                <Text pt='8' variant='kiosk'>
                  {selectedProduct.description}
                </Text>
              </Box>
              {/* Size Options */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 1 && (
                <>
                  <Heading variant='h2_Kiosk' pb='5' pt='8'>
                    Größe:
                  </Heading>
                  <Flex gap='6'>
                    {selectedProduct.sizes.map((size) => (
                      <Button
                        key={size.size}
                        onClick={() => setSelectedSizeOption(size)}
                        variant={
                          size.size === selectedSizeOption?.size
                            ? 'solid'
                            : 'outline'
                        }
                        colorScheme='pink'
                        fontSize='xl'
                        h='3rem'
                        px='4'
                      >
                        {size.size}
                      </Button>
                    ))}
                  </Flex>
                </>
              )}
              {/* Sugar Options */}
              {selectedCategory.additives?.includes('sugar') && (
                <Box py='6'>
                  <Heading variant='h2_Kiosk' py='5'>
                    Zucker:
                  </Heading>
                  <Flex gap='6'>
                    {sugarLevels.map((level) => (
                      <Button
                        key={level}
                        onClick={() => setSelectedSugarOption(level)}
                        variant={
                          level === selectedSugarOption ? 'solid' : 'outline'
                        }
                        colorScheme='pink'
                        fontSize='xl'
                        h='3rem'
                        px='4'
                      >
                        {level === selectedSugarOption && (
                          <>
                            {level === 'zero' && (
                              <Icon boxSize={7} as={BanRegular} />
                            )}
                            {level === 's' && <Icon boxSize={7} as={RxCube} />}
                            {level === 'm' && (
                              <>
                                <Icon boxSize={7} as={RxCube} />
                                <Icon boxSize={7} as={RxCube} />
                              </>
                            )}
                            {level === 'l' && (
                              <>
                                <Icon boxSize={7} as={RxCube} />
                                <Icon boxSize={7} as={RxCube} />
                                <Icon boxSize={7} as={RxCube} />
                              </>
                            )}
                          </>
                        )}
                        <Box pl={level === selectedSugarOption ? 2 : 0}>
                          {level === 'zero'
                            ? 'Kein Zucker'
                            : level === 's'
                              ? 'Wenig'
                              : level === 'm'
                                ? 'Mittel'
                                : 'Viel'}
                        </Box>
                      </Button>
                    ))}
                  </Flex>
                </Box>
              )}
            </Box>
            <Spacer />
            {/* Action Buttons */}
            <HStack w='100%' justifyContent='space-between' gap='10' pr='4'>
              {/* Price Tag */}
              <HStack pt='0'>
                <Box>
                  <Button variant='kiosk_pricetag_big'>
                    {formatPrice(
                      selectedProduct.price +
                        (selectedSizeOption
                          ? selectedSizeOption.additionalCost
                          : 0),
                    )}
                  </Button>
                </Box>
              </HStack>
              {/* Continue Button */}
              <HStack>
                <Button
                  gap='5'
                  variant='kiosk_rainbow_big'
                  onClick={() => {
                    if (
                      !selectedCategory.mugs ||
                      selectedCategory.mugs.length === 0
                    ) {
                      handleAddToCart();
                      setActiveStep((prevStep) => prevStep + 2);
                    } else {
                      setActiveStep((prevStep) => prevStep + 1);
                    }
                  }}
                >
                  Weiter
                  <Icon boxSize='3.5rem' as={ArrowRightSharpSolid} />
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
      </Flex>
    </ModalBody>
  );
}

export default ShopModalStep0;
