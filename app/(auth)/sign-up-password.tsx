import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native'
import { ProgressBar } from 'react-native-paper';
import React, { useState } from 'react'
import FormField from '@/components/FormField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import PasswordField from '@/components/PasswordField';
import BackButton from '@/components/BackButton';

const SignUpPassword = () => {
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (!password || 
            !passwordConfirm 
        ) {
          Alert.alert("Error", "Please fill in all the fields");
        } else {

            // input validation above, if successful, write below:

        }
    }

  return (
    <SafeAreaView className='h-full mx-5'>
        <BackButton/>
        <Text className="mt-10 font-semibold text-3xl">Enter a Strong Password</Text>
        <ScrollView className='flex'>
            <View className='mt-5'>
                <PasswordField
                    title="Password"
                    value={password}
                    handleChangeText={setPassword}
                    styleOptions='mt-5'
                />
            </View>

            <View className='mt-5'>
            <PasswordField
                    title="Confirm Password"
                    value={passwordConfirm}
                    handleChangeText={setPasswordConfirm}
                    styleOptions='mt-5'
                />
            </View>

            <CustomButton
                title='Create Account'
                handlePress={submit}
                containerStyles='mt-7 bg-black'
                isLoading={isSubmitting}
                textStyles='text-base font-medium text-white'
            />

        </ScrollView>
        <View className='mb-5 mx-10'>
            <ProgressBar
                progress={1}
                color='black'
                style={{backgroundColor: '#d1d1d1'}}
            ></ProgressBar>
        </View>
    </SafeAreaView>
  )
}

export default SignUpPassword