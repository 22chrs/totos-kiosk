// ShopModalStep1.tsx

import React, { useEffect, useState } from 'react';
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
import {
  ArrowRightSharpSolid,
  BanRegular,
  CirclePlusRegular,
  CupTogoRegular,
  MugHotRegular,
} from '@/components/icons/icons';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import Image from 'next/image';
import { useCart } from '@/providers/CardContext';
import { useStepper } from '@/providers/StepperContext';
import { KIOSK_HEIGHTCONTENT_MODAL, KISOK_BORDERRADIUS } from 'src/constants';
import { Product, Category } from '@/components/kiosk/shop/Interface';

type LidOption = 'ohneDeckel' | 'inklusiveDeckel';
type ReusableOption = 'einwegVariable' | 'mehrwegVariable';

interface ShopModalStep1Props {
  selectedProduct: Product;
  selectedCategory: Category;
  formatPrice: (price: number) => string;
}

function ShopModalStep1({
  selectedProduct,
  selectedCategory,
}: ShopModalStep1Props) {
  const lidOptions: LidOption[] = ['ohneDeckel', 'inklusiveDeckel'];
  const reusableOptions: ReusableOption[] = [
    'einwegVariable',
    'mehrwegVariable',
  ];

  const {
    setActiveStep,
    selectedReusableOption,
    setSelectedReusableOption,
    selectedLidOption,
    setSelectedLidOption,
    selectedSizeOption,
    selectedSugarOption,
  } = useStepper();

  const [imageSrc, setImageSrc] = useState<string>();

  useEffect(() => {
    const imageMap: Record<string, string> = {
      'mehrwegVariable-inklusiveDeckel':
        '/kiosk/becheralternativen/Mehrwegbecherdeckel.jpg',
      'mehrwegVariable-ohneDeckel':
        '/kiosk/becheralternativen/Mehrwegbecher.jpg',
      'einwegVariable-inklusiveDeckel':
        '/kiosk/becheralternativen/Einwegbecherdeckel.jpg',
      'einwegVariable-ohneDeckel': '/kiosk/becheralternativen/Einwegbecher.jpg',
    };
    const key = `${selectedReusableOption}-${selectedLidOption}`;
    setImageSrc(imageMap[key] || '/default/path/to/image.jpg');
  }, [selectedReusableOption, selectedLidOption]);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const calculatedPrice =
      selectedProduct.price +
      (selectedSizeOption ? selectedSizeOption.additionalCost : 0);

    const productCart = {
      product: selectedProduct,
      productCategory: selectedCategory.name,
      calculatedPrice,
      vat: selectedProduct.vat,
      choosenSize: selectedSizeOption?.size,
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
                  alt={selectedProduct.name}
                  fill
                  sizes='(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw'
                  style={{ objectFit: 'cover' }}
                  src={imageSrc || '/default/path/to/image.jpg'}
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
                      Allergene und Produktinformationen
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
                        {reusableOptions.map((option) => (
                          <Button
                            gap='2'
                            key={option}
                            onClick={() => setSelectedReusableOption(option)}
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
                            {option === 'einwegVariable' ? 'Einweg' : 'Mehrweg'}
                          </Button>
                        ))}
                      </Flex>
                    </Box>

                    <Box pt='6'>
                      <Heading variant='h2_Kiosk' py='6'>
                        Deckel:
                      </Heading>
                      <Flex gap='6'>
                        {lidOptions.map((option) => (
                          <Button
                            gap='2'
                            key={option}
                            onClick={() => setSelectedLidOption(option)}
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
                              : 'Inklusive Deckel'}
                          </Button>
                        ))}
                      </Flex>
                    </Box>
                  </Box>
                )}
              </Box>
              <Spacer />

              <HStack
                justifyContent={
                  selectedReusableOption !== 'mehrwegVariable'
                    ? 'flex-end'
                    : 'space-between'
                }
                gap='10'
                w='100%'
                pr='4'
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
                  transform={
                    selectedReusableOption !== 'mehrwegVariable'
                      ? 'translateY(-0.35rem)'
                      : ''
                  }
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
