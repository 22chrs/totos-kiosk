import { Box, Progress, Text } from '@chakra-ui/react';

interface ProgressBarProps {
  name: string;
  valueName: string;
  unit: string;
  value: number;
  maxValue: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  name,
  valueName,
  value,
  maxValue,
  unit,
}) => {
  // Calculate percentage
  const percentage = (value / maxValue) * 100;

  return (
    <Box>
      <Text>
        {name} ({value} / {maxValue}) {unit}
      </Text>
      <Progress colorScheme='purple' size='lg' value={percentage} />
      <Box></Box>
    </Box>
  );
};

export default ProgressBar;
