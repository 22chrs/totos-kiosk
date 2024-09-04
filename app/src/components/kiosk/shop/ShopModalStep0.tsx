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
import { RxCube } from 'react-icons/rx';

import { GlutenFreeEmblem, VeganEmblem } from '@/components/icons/emblems';
import { BanRegular } from '@/components/icons/icons';
import { useCart } from '@/providers/CardContext';
import { useStepper } from '@/providers/StepperContext';
import { KIOSK_HEIGHTCONTENT_MODAL, KISOK_BORDERRADIUS } from 'src/constants';
import { handleUmlauts } from './utils';

function ShopModalStep0({ selectedProduct, selectedCategory, formatPrice }) {
  const sugarLevels = ['zero', 's', 'm', 'l'];

  const {
    activeStep,
    setActiveStep,
    selectedSizeOption,
    setSelectedSizeOption,
    selectedSugarOption,
    setSelectedSugarOption,
  } = useStepper();

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const productCart = {
      product: selectedProduct,
      productCategory: selectedCategory.name,
      // we dont want to add the idCart, because the handleAddToCart should generate it for us
      calculatedPrice:
        selectedProduct.price +
        (selectedSizeOption ? selectedSizeOption.additionalCost : 0),
      //choosenSize: selectedSizeOption ? selectedSizeOption.size : undefined,
      vat: selectedProduct.vat,
      choosenSize: null,
      choosenSugar: selectedSugarOption,
      choosenMug: null,
      choosenLid: null,
      quantity: 1,
    };

    addToCart(productCart);
  };

  return (
    <ModalBody pt='0'>
      {selectedProduct && (
        <Flex direction='column' height='100%'>
          <HStack spacing='20' alignItems='flex-start'>
            <Box pt='2'>
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
                  src={`/kiosk/products/images/${handleUmlauts(
                    selectedProduct.name,
                  )}.jpg`}
                />

                <Box position='absolute' bottom='5' left='8' zIndex='10'>
                  <VStack gap='8'>
                    {selectedProduct.glutenfree && (
                      <Image
                        src='/assets/icons/glutenfree.svg' // Ensure the path to the SVG is correct
                        alt='Gluten Free'
                        width={95}
                        height={95}
                      />
                    )}
                    {selectedProduct.vegan && (
                      <Image
                        src='/assets/icons/vegan.svg' // Ensure the path to the SVG is correct
                        alt='Vegan'
                        width={90}
                        height={90}
                      />
                    )}
                  </VStack>
                </Box>
              </Box>
            </Box>
            <VStack
              alignItems='flex-start'
              spacing='0'
              height={KIOSK_HEIGHTCONTENT_MODAL}
            >
              <Box>
                <Box maxW='80%'>
                  <Heading
                    py='0'
                    variant='h1_Kiosk'
                    //transform='translateY(-0.2rem)'
                  >
                    {selectedProduct?.name}
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

                <Box>
                  <Box>
                    {selectedProduct.sizes &&
                      selectedProduct.sizes.length > 1 && (
                        <>
                          <Heading variant='h2_Kiosk' pb='3' pt='8'>
                            Größe:
                          </Heading>
                          <Flex gap='5'>
                            {selectedProduct.sizes.map((size, index) => (
                              <Button
                                key={index}
                                onClick={() => setSelectedSizeOption(size)}
                                variant={
                                  size === selectedSizeOption
                                    ? 'solid'
                                    : 'outline'
                                }
                                colorScheme='pink'
                              >
                                {size.size}
                              </Button>
                            ))}
                          </Flex>
                        </>
                      )}
                  </Box>

                  {selectedCategory.additives?.includes('sugar') && (
                    <Box py='6'>
                      <Heading variant='h2_Kiosk' py='3'>
                        Zucker:
                      </Heading>
                      <Flex gap='5'>
                        {sugarLevels.map((level, index) => (
                          <Button
                            key={index}
                            onClick={() => setSelectedSugarOption(level)}
                            variant={
                              level === selectedSugarOption
                                ? 'solid'
                                : 'outline'
                            }
                            colorScheme='pink'
                          >
                            {level === selectedSugarOption && (
                              <>
                                {level === 'zero' && (
                                  <Icon boxSize={7} as={BanRegular} />
                                )}
                                {level === 's' && (
                                  <Icon boxSize={7} as={RxCube} />
                                )}
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
                                    : level === 'l'
                                      ? 'Viel'
                                      : ''}
                            </Box>
                          </Button>
                        ))}
                      </Flex>
                    </Box>
                  )}
                </Box>
              </Box>
              <Spacer />

              <HStack
                maxW='88%'
                justifyContent='space-between'
                gap='10'
                transform='translateY(0.4rem) translateX(-0.2rem)'
              >
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
                  <Icon boxSize='2rem' as={FaArrowRight} />
                </Button>
              </HStack>
            </VStack>
          </HStack>
        </Flex>
      )}
    </ModalBody>
  );
}

export default ShopModalStep0;
