import { View, Text, TextInput } from 'react-native';
import React from 'react';

type FormFieldProps = {
    title: string | undefined,
    value: string | undefined,
    handleChangeText: ((e : any) => any) | undefined,
    placeholder?: string | undefined,
    styleOptions?: string | undefined
}

export default function SearchBar({title, value, handleChangeText, placeholder, styleOptions}: FormFieldProps) {
  return (
    <View className={`space-y-2 bg-white rounded-full ${styleOptions}`}>
      {title && <Text>{title}</Text>}
      <View className='w-full h-12 px-4 items-center flex-row'>
        <TextInput 
            className='flex-1' 
            value={value}
            placeholder={placeholder} 
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}>
            </TextInput>
      </View>
    </View>
  );
}