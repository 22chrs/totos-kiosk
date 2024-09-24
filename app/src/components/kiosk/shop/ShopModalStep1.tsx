// ShopModalStep1.tsx
import {
  ArrowRightSharpSolid,
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
      vat: selectedProduct.vat,
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
        <Flex direction='column' height='100%' pr='3'>
          <HStack spacing='10' alignItems='flex-start'>
            <Box pt='0'>
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
                  src={imageSrc}
                />
              </Box>
            </Box>

            <VStack
              alignItems='flex-start'
              spacing='0'
              w='100%'
              height={KIOSK_HEIGHTCONTENT_MODAL}
            >
              <Box>
                <Box maxW='93%'>
                  <Heading pb='0' variant='h1_Kiosk'>
                    Becherwahl
                  </Heading>
                  <HStack>
                    <Icon
                      pr='0.1rem'
                      boxSize='1.2rem'
                      as={HiOutlineMagnifyingGlass}
                    />
                    <Text as='u' pt='0' fontSize='xl'>
                      Nachhaltigkeit
                    </Text>
                  </HStack>

                  <Text pt='8' variant='kiosk'>
                    {selectedReusableOption === 'mehrwegVariable'
                      ? 'Die Mehrwegartikel kannst du deutschlandweit bei allen RECUP-Partnern zurückgeben.'
                      : 'Unsere Einwegbecher und Deckel bestehen aus einem umweltfreundlichen Material und sind biologisch abbaubar.'}
                  </Text>
                </Box>

                {selectedCategory.mugs.length > 1 && (
                  <Box>
                    <Box>
                      <Heading variant='h2_Kiosk' pb='6' pt='8'>
                        Ein- oder Mehrweg:
                      </Heading>

                      <Flex gap='6'>
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
                              fontSize='xl'
                              h='3rem'
                              px='4'
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
                          ),
                        )}
                      </Flex>
                    </Box>

                    <Box pt='6'>
                      <Heading variant='h2_Kiosk' py='6'>
                        Deckel:
                      </Heading>
                      <Flex gap='6'>
                        {lidOptions.map((option, index) => (
                          <Button
                            gap='2'
                            key={index}
                            onClick={() => handleLidOptionSelection(option)}
                            variant={
                              option === selectedLidOption ? 'solid' : 'outline'
                            }
                            colorScheme='pink'
                            fontSize='xl'
                            h='3rem'
                            px='4'
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
                style={{
                  justifyContent:
                    selectedReusableOption !== 'mehrwegVariable'
                      ? 'flex-end'
                      : 'space-between',
                }}
                gap='10'
                w='100%'
                pr='2.5'
              >
                {selectedReusableOption === 'mehrwegVariable' && (
                  <HStack pt='0'>
                    <Box>
                      <Button variant='kiosk_pricetag_big'>
                        {selectedLidOption === 'ohneDeckel'
                          ? '+ 1 € Pfand'
                          : '+ 2 € Pfand'}
                      </Button>
                    </Box>
                  </HStack>
                )}
                <HStack
                  style={{
                    transform:
                      selectedReusableOption !== 'mehrwegVariable'
                        ? 'translateY(-0.35rem)'
                        : '',
                  }}
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
                    <Icon boxSize='3.5rem' as={ArrowRightSharpSolid} />
                  </Button>
                </HStack>
              </HStack>
            </VStack>
          </HStack>
        </Flex>
      )}
    </ModalBody>
  );
}

export default ShopModalStep1;
