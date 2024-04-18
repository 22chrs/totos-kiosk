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
    colorScheme='purple'
    size='lg'
    w='full'
    fontWeight='extrabold'
    py={{ md: '6' }}
    {...props}
  />
);

export const CardBadge = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex
      bg={useColorModeValue('pink.500', 'pink.200')}
      position='absolute'
      right={-20}
      top={6}
      width='13rem'
      transform='rotate(45deg)'
      py={2}
      justifyContent='center'
      alignItems='center'
      {...flexProps}
    >
      <Text
        fontSize='0.8rem'
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
      bg={useColorModeValue(
        'footerBGColor.lightMode',
        'footerBGColor.darkMode',
      )}
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
      {isPopular && (
        <CardBadge fontWeight='700' pr='2.1rem'>
          Ausgewählt
        </CardBadge>
      )}
      {children}
    </Box>
  );
};

export interface PricingCardData {
  features: string[];
  name: string;
  subtitel: string;
  price: string;
  dayTwoPrice?: string;
}

interface PricingCardProps extends CardProps {
  data: PricingCardData;
  icon: ElementType;
  iconDayTwoPrice?: ElementType;
  button: ReactElement;
  isMarked?: boolean;
}
export const PricingCard = (props: PricingCardProps) => {
  const { data, icon, iconDayTwoPrice, button, isMarked, ...rest } = props;
  const { features, price, dayTwoPrice, name, subtitel } = data;
  const accentColor = useColorModeValue('purple.600', 'purple.200');

  return (
    <Card border='2px' rounded={{ sm: 'xl' }} {...rest}>
      <VStack spacing={1}>
        <Box pb='4'>
          <Heading size='2xl' fontWeight='700'>
            {name}
          </Heading>
          <Heading size='md' fontWeight='700' pt='2'>
            {subtitel}
          </Heading>
        </Box>
      </VStack>

      {/* Conditionally render "erster Tag" price if price is provided */}
      {price && (
        <Flex
          align='flex-end'
          justify='center'
          fontWeight='extrabold'
          color={accentColor}
          mt='4'
          mb='1'
        >
          <Heading size='2xl' fontWeight='inherit' pr='2'>
            {price}
          </Heading>
          {dayTwoPrice && (
            <Text fontWeight='inherit' fontSize='xl' pt='0'>
              / erster Tag
            </Text>
          )}
        </Flex>
      )}

      <Flex
        align='flex-end'
        justify='center'
        fontWeight='extrabold'
        color={accentColor}
        mb='4'
      >
        {dayTwoPrice && (
          <HStack>
            <Icon
              aria-hidden
              as={iconDayTwoPrice}
              fontSize='2xl'
              color={accentColor}
            />
            <Heading size='md' fontWeight='700' pl='2'>
              {dayTwoPrice}
            </Heading>
            <Text fontWeight='inherit' pb='0.5rem'>
              / jeder weiterer Tag
            </Text>
          </HStack>
        )}
      </Flex>

      <List spacing='4' pt='5' mb='8' maxW='28ch' mx='auto'>
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
      <Box px='4' pb='5'>
        {button}
      </Box>
    </Card>
  );
};
