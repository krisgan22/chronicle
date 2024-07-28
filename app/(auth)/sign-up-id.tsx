import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native'
import { ProgressBar } from 'react-native-paper';
import React, { useState } from 'react'
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import BackButton from '@/components/BackButton';

const SignUpID = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (!username || 
            !email || 
            !phone
        ) {
          Alert.alert("Error", "Please fill in all the fields");
        } else {

            // input validation above, if successful, write below:
            AsyncStorage.setItem("signup_username", username);
            AsyncStorage.setItem("signup_email", email);
            AsyncStorage.setItem("signup_phone", phone);

            router.push("/sign-up-names")
        }
    }

  return (
    <SafeAreaView className='h-full mx-5'>
        <BackButton/>
        <Text className="mt-10 font-semibold text-3xl">Let's Get You Signed-Up!</Text>
        <ScrollView className='flex'>
            <View className='mt-5'>
                <FormField
                    title='Username'
                    value={username}
                    handleChangeText={setUsername}
                >
                </FormField>
            </View>

            <View className='mt-5'>
                <FormField
                    title='Email'
                    value={email}
                    handleChangeText={setEmail}
                    keyboardType='email-address'
                >
                </FormField>
            </View>

            <View className='mt-5'>
                <FormField
                    title='Phone'
                    value={phone}
                    handleChangeText={setPhone}
                    keyboardType='phone-pad'
                >
                </FormField>
            </View>

            <CustomButton
                title='Next'
                handlePress={submit}
                containerStyles='mt-7 bg-black'
                isLoading={isSubmitting}
                textStyles='text-base font-medium text-white'
            />

        </ScrollView>
        <View className='mb-5 mx-10'>
            <ProgressBar
                progress={0.25}
                color='black'
                style={{backgroundColor: '#d1d1d1'}}
            ></ProgressBar>
        </View>
    </SafeAreaView>
  )
}

export default SignUpID