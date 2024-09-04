import { Box, Icon, useColorModeValue } from '@chakra-ui/react';
import { CircleInfoRegular } from '../icons/icons'; // Assuming you have these icons available

const InfoCircle = ({ onOpen }) => {
  const handleInfoClick = (e) => {
    e.stopPropagation(); // Prevent the event from bubbling up and triggering handlePageClick
    onOpen(); // Open the modal
  };

  return (
    <Box
      py='10'
      px='10'
      position='fixed'
      borderRadius='10rem' // Round corners
      right={useColorModeValue('2.3vw', '2.5vw')}
      top={useColorModeValue('2vh', '3vh')}
      onClick={handleInfoClick} // Handle click on the circle icon
    >
      <Icon
        p={useColorModeValue('2', '0')}
        as={CircleInfoRegular}
        bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.3)')}
        fontSize={useColorModeValue('7rem', '6rem')}
        display='flex' // Centering the text/icon
        alignItems='center' // Centering the text/icon
        justifyContent='center' // Centering the text/icon
        borderRadius='10rem' // Round corners
      >
        Touch me.
      </Icon>
    </Box>
  );
};

export default InfoCircle;
