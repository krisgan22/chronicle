import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native'
import { ProgressBar } from 'react-native-paper';
import React, { useState } from 'react'
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import BackButton from '@/components/BackButton';
import { checkExistenceInUserTable } from '@/appwrite_backend/service';

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
            try {
                setIsSubmitting(true);

                setUsername(username.trim())
                // Check for correct format
                // Username
                if (username.length < 4 || username.length > 20) {
                    Alert.alert("Error", "Username must be between 4 and 20 characters long")
                    return
                }
                const usernameRegex = /^[a-zA-Z0-9._-]+$/;
                if (!usernameRegex.test(username)) {
                    Alert.alert("Error", "Username can only contain letters, numbers, underscores, hyphens, and periods");
                    return
                }
                const consecutiveSpecialCharsRegex = /[_\-.]{2,}/;
                if (consecutiveSpecialCharsRegex.test(username)) {
                    Alert.alert("Error", "Username cannot contain consecutive special characters");
                    return
                }

                const reservedWords = ["admin", "root", "username", "null"];
                if (reservedWords.includes(username.toLowerCase())) {
                    Alert.alert("Error", "This username is reserved and cannot be used.");
                    return
                }

                if (/\s/.test(username)) {
                    Alert.alert("Error", "Username cannot contain spaces");
                    return
                }

                // Email
                setEmail(email.trim())
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    Alert.alert("Error", "Invalid email format");
                    return
                }

                const MAX_EMAIL_LENGTH = 254;
                if (email.length > MAX_EMAIL_LENGTH) {
                    Alert.alert("Error", "Email is too long");
                    return
                }

                if (/\s/.test(email)) {
                    Alert.alert("Error", "Email cannot contain spaces");
                    return
                }

                // Phone
                const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;
                if (!phoneNumberRegex.test(phone)) {
                    Alert.alert("Error", "Invalid phone number format");
                    return
                }

                const MIN_PHONE_LENGTH = 10;
                const MAX_PHONE_LENGTH = 15;
                const digitsOnly = phone.replace(/\D/g, ''); // Remove non-digit characters
                if (digitsOnly.length < MIN_PHONE_LENGTH || digitsOnly.length > MAX_PHONE_LENGTH) {
                    Alert.alert("Error", "Phone number must be between 10 and 15 digits long");
                    return
                }

                if (/\s/.test(phone)) {
                    Alert.alert("Error", "Phone number cannot contain spaces");
                    return
                  }
                  
                  // Remove any spaces and special characters
                  const sanitizedNumber = phone.replace(/[^\d+]/g, '');
                  if (sanitizedNumber !== phone) {
                    Alert.alert("Error", "Phone number contains invalid characters");
                    return
                  }

                // Check existence in backend
                const usernameCheck = await checkExistenceInUserTable("username", username);
                if (usernameCheck && usernameCheck.total !== 0) {
                    Alert.alert("Error", "That username is already being used");
                    return
                }

                const emailCheck = await checkExistenceInUserTable("email", email);
                if (emailCheck && emailCheck.total !== 0) {
                    Alert.alert("Error", "That email is already being used");
                    return
                }

                const phoneCheck = await checkExistenceInUserTable("phone_num", phone);
                if (phoneCheck && phoneCheck.total !== 0) {
                    Alert.alert("Error", "That phone is already being used");
                    return
                }

                // Inputs passed all checks, save information and proceed
                await AsyncStorage.setItem("signup_username", username);
                await AsyncStorage.setItem("signup_email", email);
                await AsyncStorage.setItem("signup_phone", phone);

                router.push("/sign-up-names")

            } catch (error) {
                console.log("sign-up-id: submit(): ", error);   
            } finally {
                setIsSubmitting(false);
            }
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
                    keyboardType='number-pad'
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