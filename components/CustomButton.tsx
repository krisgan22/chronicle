import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

type CustomButtonProps = {
    title: string | undefined,
    handlePress: (() => any) | undefined,
    containerStyles?: string | undefined,
    textStyles?: string | undefined,
    isLoading?: boolean
}

export default function CustomButton({title, handlePress, containerStyles, textStyles, isLoading}: CustomButtonProps) {
  return (
    <TouchableOpacity 
      className={`rounded-xl h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      onPress={handlePress}
      activeOpacity={0.7}
      > 
        <Text className={`#000000 ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
}