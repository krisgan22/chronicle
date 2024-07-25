import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { signOutAccountDeleteSession, getOrganizations } from '@/appwrite_backend/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';

const Profile = () => {
    const { user, setUser, setIsSignedIn} = useAppwriteContext();
    const [isSubmitting, setIsSubmitting] = useState(false)


    const submit = async () => {
        try {
            setIsSubmitting(true);
            await signOutAccountDeleteSession();
            
            // Remove from Async Storage
            await AsyncStorage.removeItem('user');
            console.log("Async Storage remove user");
            await AsyncStorage.removeItem('welcomeMsg');
            console.log("Async Storage remove welcomeMsg flag");

            // Update global appwrite context
            setUser(null);
            setIsSignedIn(false);

            router.replace('/sign-in');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
        console.log("user: ", user);
    }

  return (
    <SafeAreaView className='h-full m-5'>
        <CustomButton
            title='Log Out'
            handlePress={submit}
            containerStyles='bg-rose-700'
            isLoading={isSubmitting}
            textStyles='text-base font-medium text-white'
        />
    </SafeAreaView>
  )
}

export default Profile