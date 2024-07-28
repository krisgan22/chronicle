import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native'
import { ProgressBar } from 'react-native-paper';
import React, { useState } from 'react'
import FormField from '@/components/FormField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import BackButton from '@/components/BackButton';

const SignUpNames = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (!firstName || 
            !lastName 
        ) {
          Alert.alert("Error", "Please fill in all the fields");
        } else {

            // input validation above, if successful, write below:
            AsyncStorage.setItem("signup_firstname", firstName);
            AsyncStorage.setItem("signup_lastname", lastName);

            router.push("/sign-up-employer")
        }
    }

  return (
    <SafeAreaView className='h-full mx-5'>
        <BackButton/>
        <Text className="mt-10 font-semibold text-3xl">What's Your Name?</Text>
        <ScrollView className='flex'>
            <View className='mt-5'>
                <FormField
                    title='First Name'
                    value={firstName}
                    handleChangeText={setFirstName}
                >
                </FormField>
            </View>

            <View className='mt-5'>
                <FormField
                    title='Last Name'
                    value={lastName}
                    handleChangeText={setLastName}
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
                progress={0.50}
                color='black'
                style={{backgroundColor: '#d1d1d1'}}
            ></ProgressBar>
        </View>
    </SafeAreaView>
  )
}

export default SignUpNames