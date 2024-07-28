import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';
import React from 'react';

type FormFieldProps = {
    title: string | undefined,
    value: string | undefined,
    handleChangeText: ((e : any) => any) | undefined,
    placeholder?: string | undefined,
    styleOptions?: string | undefined,
    keyboardType?: KeyboardTypeOptions | undefined,
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined,
}

export default function FormField({title, value, handleChangeText, placeholder, styleOptions, keyboardType, autoCapitalize}: FormFieldProps) {
  return (
    <View className={`mb-2 ${styleOptions}`}>
      {title && <Text className='mb-2 font-medium'>{title}</Text>}
      <View className='border border-black w-full h-12 px-4 rounded-2xl items-center flex-row'>
        <TextInput 
            className='flex-1' 
            value={value}
            placeholder={placeholder} 
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            textContentType='oneTimeCode'
            autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
            autoCorrect={false}
            keyboardType={keyboardType ? keyboardType : "default"}>
            </TextInput>
      </View>
    </View>
  );
}