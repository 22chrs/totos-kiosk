// components/ActionButtons.tsx

import React from 'react';
import {
  HStack,
  Text,
  Button,
  ButtonProps,
  TextProps,
  StackProps,
  Box,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Heading,
} from '@chakra-ui/react';

interface ActionButton {
  label: string;
  onClick: () => void;
  buttonProps?: ButtonProps;
}

interface ActionButtonsProps extends StackProps {
  heading?: string;
  label?: string;
  customComponent?: React.ReactNode;
  buttons: ActionButton[];
  textProps?: TextProps;
  showSlider?: boolean; // New prop to control slider visibility
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  heading = '',
  label,
  customComponent,
  buttons,
  textProps,
  showSlider = true, // Default to showing the slider
  ...StackProps
}) => {
  // Filter out buttons with empty labels
  const filteredButtons = buttons.filter(
    (button) => button.label?.trim() !== '',
  );

  return (
    <HStack gap='10' align='center' {...StackProps} py='1'>
      {heading && (
        <Heading pb='2' size='lg'>
          {heading}
        </Heading>
      )}
      {label && !customComponent && <Text {...textProps}>{label}</Text>}
      {customComponent && showSlider && <Box flex='1'>{customComponent}</Box>}
      {filteredButtons.map((button, index) => (
        <Button key={index} onClick={button.onClick} {...button.buttonProps}>
          {button.label}
        </Button>
      ))}
    </HStack>
  );
};

interface SliderWithTooltipProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  colorScheme?: string;
}

export const SliderWithTooltip: React.FC<SliderWithTooltipProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <Slider
      aria-label='slider-with-tooltip'
      value={value}
      min={min}
      max={max}
      colorScheme='purple'
      onChange={onChange}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg='purple.400'
        color='white'
        placement='top'
        isOpen={showTooltip}
        label={`${value}%`}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
};
