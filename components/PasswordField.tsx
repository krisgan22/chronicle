import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';


type PasswordFieldProps = {
    title: string | undefined,
    value: string | undefined,
    handleChangeText: ((e : any) => any) | undefined,
    placeholder?: string | undefined,
    styleOptions?: string | undefined
}

export default function PasswordField({title, value, handleChangeText, placeholder, styleOptions}: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false)
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
            secureTextEntry={!showPassword}
            clearTextOnFocus={false}
            textContentType='oneTimeCode'
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {!showPassword ? <Ionicons name="eye" size={24} color="black" /> : <Ionicons name="eye-off" size={24} color="black" />}
            </TouchableOpacity>
      </View>
    </View>
  );
}