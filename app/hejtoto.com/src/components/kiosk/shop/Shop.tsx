import { Box, Grid, HStack, Image, Text } from '@chakra-ui/react';

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

type ShopProps = {
  data: Category[];
  country: string;
  currency: string;
};

const Shop: React.FC<ShopProps> = ({ data, country, currency }) => {
  // Format the price
  const formatPrice = (price: number) =>
    new Intl.NumberFormat(country, { style: 'currency', currency }).format(
      price
    );

  return (
    <HStack align='start' spacing={8}>
      {data.map((category) => (
        <Box key={category.category}>
          <Text fontSize='2xl' fontWeight='bold'>
            {category.category}
          </Text>
          <Grid templateColumns='repeat(auto-fill, minmax(250px, 1fr))' gap={6}>
            {category.items.map((product) => (
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
          </Grid>
        </Box>
      ))}
    </HStack>
  );
};

export default Shop;
