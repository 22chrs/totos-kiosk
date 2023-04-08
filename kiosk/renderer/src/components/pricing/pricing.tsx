import { Box, BoxProps, Button, ButtonProps, HStack } from '@chakra-ui/react';

import {
  Flex,
  FlexProps,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

import { ElementType, ReactElement } from 'react';
import { HiCheckCircle } from 'react-icons/hi';

export interface CardProps extends BoxProps {
  isPopular?: boolean;
}

export const ActionButton = (props: ButtonProps) => (
  <Button
    colorScheme='blue'
    size='lg'
    w='full'
    fontWeight='extrabold'
    py={{ md: '8' }}
    {...props}
  />
);

export const CardBadge = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex
      bg={useColorModeValue('blue.500', 'blue.200')}
      position='absolute'
      right={-20}
      top={6}
      width='240px'
      transform='rotate(45deg)'
      py={2}
      justifyContent='center'
      alignItems='center'
      {...flexProps}
    >
      <Text
        fontSize='xs'
        textTransform='uppercase'
        fontWeight='bold'
        letterSpacing='wider'
        color={useColorModeValue('white', 'gray.800')}
      >
        {children}
      </Text>
    </Flex>
  );
};

export const Card = (props: CardProps) => {
  const { children, isPopular, ...rest } = props;
  return (
    <Box
      bg={useColorModeValue('white', 'gray.700')}
      position='relative'
      px='6'
      pb='6'
      pt='16'
      overflow='hidden'
      shadow='lg'
      maxW='md'
      width='100%'
      {...rest}
    >
      {isPopular && <CardBadge>Popular</CardBadge>}
      {children}
    </Box>
  );
};

export interface PricingCardData {
  features: string[];
  name: string;
  subtitel: string;
  price: string;
  dayTwoPrice: string;
}

interface PricingCardProps extends CardProps {
  data: PricingCardData;
  icon: ElementType;
  iconDayTwoPrice: ElementType;
  button: ReactElement;
}

export const PricingCard = (props: PricingCardProps) => {
  const { data, icon, iconDayTwoPrice, button, ...rest } = props;
  const { features, price, dayTwoPrice, name, subtitel } = data;
  const accentColor = useColorModeValue('blue.600', 'blue.200');

  return (
    <Card border='2px' rounded={{ sm: 'xl' }} {...rest}>
      <VStack spacing={1}>
        <Box pb='4'>
          <Heading size='2xl' fontWeight='700'>
            {name}
          </Heading>
          <Heading size='md' fontWeight='700'>
            {subtitel}
          </Heading>
        </Box>
      </VStack>
      <Flex
        align='flex-end'
        justify='center'
        fontWeight='extrabold'
        color={accentColor}
        my='4'
      >
        <Heading size='2xl' fontWeight='inherit' lineHeight='0.9em'>
          {price}
        </Heading>
        <Text fontWeight='inherit' fontSize='xl'>
          / erster Tag
        </Text>
      </Flex>

      <Flex
        align='flex-end'
        justify='center'
        fontWeight='extrabold'
        color={accentColor}
        my='4'
      >
        <HStack>
          <Icon
            aria-hidden
            //size='md'
            as={iconDayTwoPrice}
            fontSize='2xl'
            color={accentColor}
          />
          <Heading size='md' fontWeight='700'>
            {dayTwoPrice}
          </Heading>
          <Text fontWeight='inherit' fontSize='md'>
            / jeder weiterer Tag
          </Text>
        </HStack>
      </Flex>

      <br />
      <br />
      <List spacing='4' mb='8' maxW='28ch' mx='auto'>
        {features.map((feature, index) => (
          <ListItem fontWeight='medium' key={index}>
            <ListIcon
              fontSize='xl'
              as={HiCheckCircle}
              marginEnd={2}
              color={accentColor}
            />
            {feature}
          </ListItem>
        ))}
      </List>
      {button}
    </Card>
  );
};
