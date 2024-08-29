import { TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

type CustomButtonProps = {
    containerStyles?: string | undefined,
    textStyles?: string | undefined,
    isLoading?: boolean
}

export default function BackButton({containerStyles, textStyles, isLoading}: CustomButtonProps) {
  return (
    <TouchableOpacity 
      className={`my-5 bg-black rounded-full h-8 w-12 justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      onPress={() => {
        router.back();
      }}
      activeOpacity={0.7}
      > 
      <Text className={`text-white font-interLight ${textStyles}`}>←</Text>
    </TouchableOpacity>
  );
}