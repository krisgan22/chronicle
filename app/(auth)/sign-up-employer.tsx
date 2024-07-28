import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native'
import { ProgressBar } from 'react-native-paper';
import React, { useState } from 'react'
import FormField from '@/components/FormField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import BackButton from '@/components/BackButton';

const SignUpEmployer = () => {
    const [employer, setEmployer] = useState("");
    const [matchRate, setMatchRate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitEmployer = async () => {
        if (!employer || 
            !matchRate 
        ) {
          Alert.alert("Error", "Please fill in all the fields");
        } else {

            // input validation above, if successful, write below:
            AsyncStorage.setItem("signup_employer", employer);
            AsyncStorage.setItem("signup_matchRate", matchRate);

            router.push("/sign-up-password")
        }
    }

    const submitNA = async () => {
    }

  return (
    <SafeAreaView className='h-full mx-5'>
        <BackButton/>
        <Text className="mt-10 font-semibold text-3xl">Who is Your Employer?</Text>
        <ScrollView className='flex'>
            <View className='mt-5'>
                <FormField
                    title='Employer'
                    value={employer}
                    handleChangeText={setEmployer}
                >
                </FormField>
            </View>

            <View className='mt-5'>
                <FormField
                    title='Employer Matching Rate'
                    value={matchRate}
                    handleChangeText={setMatchRate}
                    keyboardType='numeric'
                >
                </FormField>
            </View>

            <CustomButton
                title='Next'
                handlePress={submitEmployer}
                containerStyles='mt-7 bg-black'
                isLoading={isSubmitting}
                textStyles='text-base font-medium text-white'
            />
            <CustomButton
                title='Not Applicable'
                handlePress={submitNA}
                containerStyles='mt-7 bg-rose-700'
                isLoading={isSubmitting}
                textStyles='text-base font-medium text-white'
            />

        </ScrollView>
        <View className='mb-5 mx-10'>
            <ProgressBar
                progress={0.75}
                color='black'
                style={{backgroundColor: '#d1d1d1'}}
            ></ProgressBar>
        </View>
    </SafeAreaView>
  )
}

export default SignUpEmployer