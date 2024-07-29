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
            try {
                // Check for correct format
                // Employer Name
                setEmployer(employer.trim());
                if (employer.length < 1 || employer.length > 50) {
                    Alert.alert("Error", "Employer name must be between 1 and 50 characters long")
                    return
                }
                const employerRegex = /^[a-zA-Z0-9._-]+$/;
                if (!employerRegex.test(employer)) {
                    Alert.alert("Error", "Employer name can only contain letters, numbers, underscores, hyphens, and periods");
                    return
                }
                const consecutiveSpecialCharsRegex = /[_\-.]{2,}/;
                if (consecutiveSpecialCharsRegex.test(employer)) {
                    Alert.alert("Error", "Employer name cannot contain consecutive special characters");
                    return
                }

                // Matching Rate
                setMatchRate(matchRate.trim());
                if (isNaN(Number(matchRate))) {
                    Alert.alert("Error", "Matching rate must be a number");
                    return
                }

                const MIN_RATE = 0.01; // Minimum allowable rate
                const MAX_RATE = 1000; // Maximum allowable rate
                const rate = Number(matchRate);
                if (rate < MIN_RATE || rate > MAX_RATE) {
                    Alert.alert("Error", `Matching rate must be between ${MIN_RATE} and ${MAX_RATE}`);
                    return
                }

                if (rate <= 0) {
                    Alert.alert("Error", "Matching rate must be greater than zero");
                    return
                }

                const decimalPlaces = (matchRate.split('.')[1] || '').length;
                if (decimalPlaces > 2) {
                    Alert.alert("Error", "Matching rate can have a maximum of two decimal places");
                    return
                }
                
                // input validation above, if successful, write below:
                await AsyncStorage.setItem("signup_employer", employer);
                await AsyncStorage.setItem("signup_matchRate", matchRate);
    
                router.push("/sign-up-password")

            } catch (error) {
                console.log("sign-up-employer.tsx: submitEmployer(): ", error);
            }

        }
    }

    const submitNA = async () => {
        await AsyncStorage.setItem("signup_employer", "");
        await AsyncStorage.setItem("signup_matchRate", "");

        router.push("/sign-up-password")
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
                    title='Employer Matching Rate ($/hr)'
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