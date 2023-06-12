import {
  Box,
  Heading,
  HStack,
  Image,
  ListItem,
  Stack,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';

type ImageAndTextProps = {
  imageUrl: string;
  title: string;
  listItems: string[];
};

const ImageAndText = ({ imageUrl, title, listItems }: ImageAndTextProps) => {
  const imageHeight = '12rem'; // 5.5rem

  return (
    <HStack align='center' gap='10' py='2.5'>
      <Stack>
        <Box
          borderRadius='xl'
          minH={imageHeight}
          minW={imageHeight}
          maxH={imageHeight}
          maxW={imageHeight}
          h={imageHeight}
          w={imageHeight}
          position='relative'
          overflow='hidden'
        >
          <Image
            alt={`${title}`}
            fill='true'
            object-fit='contain'
            sizes='(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw'
            style={{ objectFit: 'cover' }}
            src={imageUrl}
          />
        </Box>
      </Stack>
      <VStack align='start' justify='start'>
        <Heading variant='h2' m='0' pb='5'>
          {title}
        </Heading>
        <UnorderedList spacing={1} pl='5'>
          {listItems.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </UnorderedList>
      </VStack>
    </HStack>
  );
};

export default ImageAndText;
