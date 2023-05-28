import { TelemetrieProduct } from '@/firebase/Interface';
import { addTelemetrieProduct } from '@/firebase/dbFunctions';
import { useEffect, useState } from 'react';

import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { formatISO } from 'date-fns';
import {
  getDatabase,
  limitToLast,
  onValue,
  query,
  ref,
} from 'firebase/database';

export const SendDataButton = () => {
  const handleClick = () => {
    const product: TelemetrieProduct = {
      productName: 'Product 1s113asd22',
      productCategory: 'Catsegory A',
      choosenSize: 'Large',
      choosenSugar: 'Medium',
      choosenMug: 'Ceramic',
      choosenLid: 'Plastic',
      choosenMilc: 'Almond',
      quantity: 1,
      calculatedPrice: 10,
      orderStatus: 'success',
      displayNumber: '1123',
      discount: 0,
      timeStamp: formatISO(new Date()),
      location: 'Location A',
    };

    addTelemetrieProduct(product)
      .then(() => {
        console.log('Product added successfully.');
      })
      .catch((error) => {
        console.error('Failed to add product:', error);
      });
  };

  return (
    <Button colorScheme='teal' onClick={handleClick}>
      Send Data
    </Button>
  );
};

export const DisplayDataProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const database = getDatabase();
    const productRef = ref(database, '/telemetrieProduct');
    const q = query(productRef, limitToLast(5));

    const listener = onValue(q, (snapshot) => {
      let fetchedData = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        fetchedData.push(data);
      });
      setProducts(fetchedData.reverse()); // reverse the array to show the latest entry on the top
    });
  }, []);

  return (
    <Box
      p={5}
      maxW='32rem'
      borderWidth={2}
      borderRadius='lg'
      overflow='auto' // enable scrolling
      maxHeight='500px' // you can adjust this
      bg='black'
      color='green.300'
      fontFamily='monospace'
    >
      <VStack spacing={5} align='stretch'>
        {products.map((product, index) => (
          <Box key={index}>
            <Text>{`Timestamp: ${product.timeStamp}`}</Text>
            <Text>{`Product Name: ${product.productName}`}</Text>
            <Text>{`Product Category: ${product.productCategory}`}</Text>
            <Text>{`Choosen Size: ${product.choosenSize}`}</Text>
            <Text>{`Choosen Sugar: ${product.choosenSugar}`}</Text>
            <Text>{`Choosen Mug: ${product.choosenMug}`}</Text>
            <Text>{`Choosen Lid: ${product.choosenLid}`}</Text>
            <Text>{`Choosen Milc: ${product.choosenMilc}`}</Text>
            <Text>{`Quantity: ${product.quantity}`}</Text>
            <Text>{`Calculated Price: ${product.calculatedPrice}`}</Text>
            <Text>{`Order Status: ${product.orderStatus}`}</Text>
            <Text>{`Display Number: ${product.displayNumber}`}</Text>
            <Text>{`Discount: ${product.discount}`}</Text>
            <Text>{`Location: ${product.location}`}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
