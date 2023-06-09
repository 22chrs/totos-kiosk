// ShopModalStep1.tsx
import {
  BanRegular,
  CirclePlusRegular,
  CupTogoRegular,
  MugHotRegular,
} from '@/components/icons/icons';
import { useCart } from '@/providers/CardContext';
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

import { FaArrowRight } from 'react-icons/fa';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

import { Product } from '@/components/kiosk/shop/Interface';
import { useStepper } from '@/providers/StepperContext';
import { useEffect, useState } from 'react';
import { KIOSK_HEIGHTCONTENT_MODAL, KISOK_BORDERRADIUS } from 'src/constants';

// Your ModalProductCardProps interface
interface ModalProductCardProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  formatPrice: (price: number) => string;
}
function ShopModalStep1({ selectedProduct, selectedCategory, formatPrice }) {
  const lidOptions = ['ohneDeckel', 'inklusiveDeckel'];

  const {
    setActiveStep,
    selectedReusableOption,
    setSelectedReusableOption,
    selectedLidOption,
    setSelectedLidOption,
    selectedSizeOption,
    selectedSugarOption,
  } = useStepper();

  const handleReusableOptionSelection = (option) => {
    setSelectedReusableOption(option);
  };

  const handleLidOptionSelection = (option) => {
    setSelectedLidOption(option);
  };

  const [imageSrc, setImageSrc] = useState<string>();
  useEffect(() => {
    if (
      selectedReusableOption === 'mehrwegVariable' &&
      selectedLidOption === 'inklusiveDeckel'
    ) {
      setImageSrc('/kiosk/becheralternativen/Mehrwegbecherdeckel.jpg');
    } else if (
      selectedReusableOption === 'mehrwegVariable' &&
      selectedLidOption === 'ohneDeckel'
    ) {
      setImageSrc('/kiosk/becheralternativen/Mehrwegbecher.jpg');
    } else if (
      selectedReusableOption === 'einwegVariable' &&
      selectedLidOption === 'inklusiveDeckel'
    ) {
      setImageSrc('/kiosk/becheralternativen/Einwegbecherdeckel.jpg');
    } else if (
      selectedReusableOption === 'einwegVariable' &&
      selectedLidOption === 'ohneDeckel'
    ) {
      setImageSrc('/kiosk/becheralternativen/Einwegbecher.jpg');
    }
  }, [selectedReusableOption, selectedLidOption]);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const productCart = {
      product: selectedProduct,
      productCategory: selectedCategory.name,
      // we dont want to add the idCart, because the handleAddToCart should generate it for us
      calculatedPrice:
        selectedProduct.price +
        (selectedSizeOption ? selectedSizeOption.additionalCost : 0),
      choosenSize: selectedSizeOption ? selectedSizeOption.size : undefined,
      choosenSugar: selectedSugarOption,
      choosenMug: selectedReusableOption,
      choosenLid: selectedLidOption,
      quantity: 1,
    };

    addToCart(productCart);
  };

  return (
    <ModalBody>
      {selectedProduct && (
        <Flex direction='column' height='100%'>
          <HStack spacing='20' alignItems='flex-start'>
            <Box
              borderRadius={KISOK_BORDERRADIUS}
              minH={KIOSK_HEIGHTCONTENT_MODAL}
              minW={`calc(${KIOSK_HEIGHTCONTENT_MODAL} * 0.75)`}
              position='relative'
              overflow='hidden'
            >
              <Image
                alt={`${selectedProduct.name}`}
                fill={true}
                object-fit='contain'
                sizes='(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw'
                style={{ objectFit: 'cover' }}
                src={imageSrc || '/default/path/to/image.jpg'}
              />
            </Box>

            <VStack
              alignItems='flex-start'
              spacing='0'
              height={KIOSK_HEIGHTCONTENT_MODAL}
            >
              <Box>
                <Box maxW='80%'>
                  <Heading pb='0' variant='h1_Kiosk'>
                    Becherwahl
                  </Heading>
                  <HStack>
                    <Icon
                      pr='0.1rem'
                      boxSize='1.2rem'
                      as={HiOutlineMagnifyingGlass}
                    />
                    <Text as='u' pt='0'>
                      Allergene und Produktinformationen
                    </Text>
                  </HStack>

                  <Text pt='4' variant='kiosk'>
                    {selectedReusableOption === 'mehrwegVariable'
                      ? 'Den RECUP Mehrwegbecher bzw. Deckel kannst du deutschlandweit bei allen RECUP-Partnern zurückgeben und Dein Pfand zurückbekommen.'
                      : 'Unsere Einwegbecher und Deckel bestehen aus einem umweltfreundlichen Material und sind biologisch abbaubar.'}
                  </Text>
                </Box>

                {selectedCategory.mugs.length > 1 && (
                  <Box>
                    {selectedReusableOption === 'mehrwegVariable' && (
                      <HStack pt='6'>
                        <Box>
                          <Button variant='kiosk_pricetag_small'>
                            {selectedLidOption === 'ohneDeckel'
                              ? '+ 1,00 € Pfand'
                              : '+ 2,00 € Pfand'}
                          </Button>
                        </Box>
                      </HStack>
                    )}

                    <Box>
                      <Heading variant='h3_Kiosk' pb='3' pt='8'>
                        Ein- oder Mehrweg:
                      </Heading>

                      <Flex gap='5'>
                        {['einwegVariable', 'mehrwegVariable'].map(
                          (option, index) => (
                            <Button
                              gap='2'
                              key={index}
                              onClick={() =>
                                handleReusableOptionSelection(option)
                              }
                              variant={
                                option === selectedReusableOption
                                  ? 'solid'
                                  : 'outline'
                              }
                              colorScheme='pink'
                            >
                              {option === selectedReusableOption && (
                                <>
                                  {option === 'einwegVariable' && (
                                    <Icon boxSize={6} as={CupTogoRegular} />
                                  )}
                                  {option === 'mehrwegVariable' && (
                                    <Icon boxSize={6} as={MugHotRegular} />
                                  )}
                                </>
                              )}
                              {option === 'einwegVariable'
                                ? 'Einweg'
                                : option === 'mehrwegVariable'
                                ? 'Mehrweg'
                                : ''}
                            </Button>
                          )
                        )}
                      </Flex>
                    </Box>

                    <Box py='3'>
                      <Heading variant='h3_Kiosk' py='3'>
                        Deckel:
                      </Heading>
                      <Flex gap='5'>
                        {lidOptions.map((option, index) => (
                          <Button
                            gap='2'
                            key={index}
                            onClick={() => handleLidOptionSelection(option)}
                            variant={
                              option === selectedLidOption ? 'solid' : 'outline'
                            }
                            colorScheme='pink'
                          >
                            {option === selectedLidOption && (
                              <>
                                {option === 'ohneDeckel' && (
                                  <Icon boxSize={6} as={BanRegular} />
                                )}
                                {option === 'inklusiveDeckel' && (
                                  <Icon boxSize={6} as={CirclePlusRegular} />
                                )}
                              </>
                            )}
                            {option === 'ohneDeckel'
                              ? 'Ohne Deckel'
                              : option === 'inklusiveDeckel'
                              ? 'Inklusive Deckel'
                              : ''}
                          </Button>
                        ))}
                      </Flex>
                    </Box>
                  </Box>
                )}
              </Box>
              <Spacer />

              <HStack
                maxW='88%'
                justifyContent='space-between'
                transform='translateY(-0.4rem) translateX(0.4rem)'
              >
                <Button
                  gap='5'
                  variant='kiosk_rainbow_big'
                  onClick={() => {
                    handleAddToCart();
                    setActiveStep((prevStep) => prevStep + 1);
                  }}
                >
                  Weiter
                  <Icon boxSize='2.5rem' as={FaArrowRight} />
                </Button>
              </HStack>
            </VStack>
          </HStack>
        </Flex>
      )}
    </ModalBody>
  );
}

export default ShopModalStep1;
