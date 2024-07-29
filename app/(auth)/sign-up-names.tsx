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
            try {
                setIsSubmitting(true);
                setFirstName(firstName.trim())
                setLastName(lastName.trim());
                // Check for correct format
                // First name
                const MIN_LENGTH = 1;
                const MAX_LENGTH = 50;
                if (firstName.length < MIN_LENGTH || firstName.length > MAX_LENGTH) {
                    Alert.alert("Error", "First name must be between 1 and 50 characters long");
                    return
                }
                const nameRegex = /^[A-Za-z'-]+$/;
                if (!nameRegex.test(firstName)) {
                    Alert.alert("Error", "First name can only contain letters, hyphens, and apostrophes");
                    return
                }

                if (/\s/.test(firstName)) {
                    Alert.alert("Error", "First name cannot contain spaces");
                    return
                }

                const consecutiveSpecialCharsRegex = /[-']{2,}/;
                if (consecutiveSpecialCharsRegex.test(firstName)) {
                    Alert.alert("Error", "First name cannot contain consecutive hyphens or apostrophes");
                    return
                }

                if (/\d/.test(firstName)) {
                    Alert.alert("Error", "First name cannot contain numbers");
                    return
                }

                // Last Name
                if (lastName.length < MIN_LENGTH || lastName.length > MAX_LENGTH) {
                    Alert.alert("Error", "Last name must be between 1 and 50 characters long");
                    return
                }
                if (!nameRegex.test(lastName)) {
                    Alert.alert("Error", "Last name can only contain letters, hyphens, and apostrophes");
                    return
                }

                if (/\s/.test(lastName)) {
                    Alert.alert("Error", "Last name cannot contain spaces");
                    return
                }

                if (consecutiveSpecialCharsRegex.test(lastName)) {
                    Alert.alert("Error", "Last name cannot contain consecutive hyphens or apostrophes");
                    return
                }

                if (/\d/.test(lastName)) {
                    Alert.alert("Error", "Last name cannot contain numbers");
                    return
                }

                // input validation above, if successful, write below:
                await AsyncStorage.setItem("signup_firstname", firstName);
                await AsyncStorage.setItem("signup_lastname", lastName);
                
                router.push("/sign-up-employer")
            
            } catch (error) {
                console.log("sign-up-names.tsx: submit(): ", error);    
            } finally {
                setIsSubmitting(false);
            }
            

        }
    }

  return (
    <SafeAreaView className='h-full mx-5 mt-10'>
        <BackButton/>
        <Text className="mt-10 font-semibold text-3xl">What's Your Name?</Text>
        <ScrollView className='flex'>
            <View className='mt-5'>
                <FormField
                    title='First Name'
                    value={firstName}
                    handleChangeText={setFirstName}
                    autoCapitalize='words'
                >
                </FormField>
            </View>

            <View className='mt-5'>
                <FormField
                    title='Last Name'
                    value={lastName}
                    handleChangeText={setLastName}
                    autoCapitalize='words'
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
        <View className='mb-20 mx-10'>
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