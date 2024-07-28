import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native'
import { ProgressBar } from 'react-native-paper';
import React, { useState } from 'react'
import FormField from '@/components/FormField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import PasswordField from '@/components/PasswordField';
import BackButton from '@/components/BackButton';
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { signUpAccount } from '@/appwrite_backend/service';

const SignUpPassword = () => {
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {setUser, setUserDetails, setIsSignedIn} = useAppwriteContext();

    const submit = async () => {
        if (!password || 
            !passwordConfirm 
        ) {
          Alert.alert("Error", "Please fill in all the fields");
        } else {
            try {
                setIsSubmitting(true);
                
                if (password !== passwordConfirm)
                {
                    Alert.alert("Error", "Passwords do not match")
                    return
                }

                const MIN_LENGTH = 8;
                const MAX_LENGTH = 256;
                if (password.length < MIN_LENGTH || password.length > MAX_LENGTH) {
                    Alert.alert("Error", `Password must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters long.`);
                    return
                }

                if (/\s/.test(password)) {
                    Alert.alert("Error", "Password cannot contain spaces.");
                    return
                }

                if (!/\d/.test(password)) {
                    Alert.alert("Error", "Password must contain at least one number.");
                    return
                }

                const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
                if (!specialCharRegex.test(password)) {
                    Alert.alert("Error", "Password must contain at least one special character.");
                    return
                }

                if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
                    Alert.alert("Error", "Password must contain both uppercase and lowercase letters.");
                    return
                }

                // All checks passed, create account

                const firstname = await AsyncStorage.getItem("signup_firstname");
                const lastname = await AsyncStorage.getItem("signup_lastname");

                const username = await AsyncStorage.getItem("signup_username");
                const email = await AsyncStorage.getItem("signup_email");
                const phone = await AsyncStorage.getItem("signup_phone");

                const employer = await AsyncStorage.getItem("signup_employer");
                const matchRate = await AsyncStorage.getItem("signup_matchRate");

                const result = await signUpAccount(email!, password, username!, firstname!, lastname!, phone!, employer!, parseFloat(matchRate!));
                if (result)
                {
                  // set to global state
                  setUser(result.session);
                  setUserDetails(result.user);
                  setIsSignedIn(true);
        
                  router.replace('/home');
                }
            } catch (error) {
                console.log("sign-up-password.tsx: submit(): ", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    }

  return (
    <SafeAreaView className='h-full mx-5'>
        <BackButton/>
        <Text className="mt-10 font-semibold text-3xl">Enter a Strong Password</Text>
        <Text className="mt-5 font-semibold">Must be 8-256 characters long, contain a special character, a lower and uppercase character, a number, and no spaces.</Text>
        <ScrollView className='flex'>
            <View className=''>
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