import { Box, Flex, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import React from 'react';

type Product = {
  name: string;
  description: string;
  price: number;
  allergens: string[];
  sizes: string[];
  vegan: boolean;
};

type Category = {
  category: string;
  items: Product[];
};

type VerticalTabsProps = {
  data: Category[];
  country: string;
  currency: string;
};

// This would be your 'tab' component
function Tab({ title, isSelected, onClick }) {
  return (
    <Box
      height='430px'
      p={4}
      borderWidth={1}
      borderRadius='md'
      cursor='pointer'
      bg={isSelected ? 'gray.500' : 'transparent'}
      onClick={onClick}
      width='100%'
    >
      <Text>{title}</Text>
      <Text>{title}</Text>
      <Text>{title}</Text>
      <Text>{title}</Text>
      <Text>{title}</Text>
      <Text>{title}</Text>
      <Text>{title}</Text>
      <Text>{title}</Text>
    </Box>
  );
}

// This would be your main component
const Shop: React.FC<VerticalTabsProps> = ({ data, country, currency }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  // Format the price
  const formatPrice = (price: number) =>
    new Intl.NumberFormat(country, { style: 'currency', currency }).format(
      price
    );

  return (
    <Flex>
      <VStack
        height='100vh'
        overflowY='auto'
        alignItems='start'
        spacing={4}
        width='30vw'
        padding={5}
      >
        {data.map((category, index) => (
          <Tab
            key={category.category}
            title={category.category}
            isSelected={selectedTab === index}
            onClick={() => setSelectedTab(index)}
          />
        ))}
        <Spacer /> {/* This is used to push the tabs to the top */}
      </VStack>
      <Flex
        overflowY='auto'
        marginLeft={8}
        width='70vw'
        justify='center'
        align='center'
        borderWidth='5px'
        height='80vh' //! variable
      >
        {data[selectedTab].items.map((product) => (
          <Box key={product.name} borderWidth={1} borderRadius='md' p={4}>
            <Image
              src={`/kiosk/products/images/${product.name}.png`}
              alt={product.name}
              boxSize='200px'
              objectFit='cover'
            />
            <Text fontSize='xl' fontWeight='bold'>
              {product.name}
            </Text>
            <Text fontWeight='bold'>{formatPrice(product.price)}</Text>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default Shop;
