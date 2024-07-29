import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { signOutAccountDeleteSession, getOrganizations } from '@/appwrite_backend/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { MaterialIcons } from '@expo/vector-icons';

const Profile = () => {
    const { user, setUser, userDetails, setUserDetails, setIsSignedIn} = useAppwriteContext();
    const [isSubmitting, setIsSubmitting] = useState(false)


    const submit = async () => {
        try {
            setIsSubmitting(true);
            await signOutAccountDeleteSession();
            
            // Remove from Async Storage
            await AsyncStorage.removeItem('user');
            console.log("Async Storage remove user session");

            await AsyncStorage.removeItem('userDetails');
            console.log("Async Storage remove user details");

            await AsyncStorage.removeItem('welcomeMsg');
            console.log("Async Storage remove welcomeMsg flag");

            // Update global appwrite context
            setUser(null);
            setUserDetails(null);
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
        <ScrollView className='flex'>
            <View className='flex flex-row justify-between'>
                <Text className="text-2xl font-bold">
                    {userDetails.username}
                </Text>
                <TouchableOpacity 
                    onPress={submit}
                    className='pt-1'
                    >
                    <MaterialIcons name="logout" size={24} color="#BE123C" />
                </TouchableOpacity>
            </View>
            <View>
                <Text className='font-semibold text-lg mt-5'>First Name</Text>
                <Text className='font-normal text-lg'>{userDetails.first_name}</Text>
                
                <Text className='font-semibold text-lg mt-5'>Last Name</Text>
                <Text className='font-normal text-lg'>{userDetails.last_name}</Text>
                
                <Text className='font-semibold text-lg mt-5'>Phone Number</Text>
                <Text className='font-normal text-lg'>{userDetails.phone_num}</Text>
                
                <Text className='font-semibold text-lg mt-5'>Email</Text>
                <Text className='font-normal text-lg'>{userDetails.email}</Text>

                <Text className='font-semibold text-lg mt-5'>Employer</Text>
                {userDetails.employer ? 
                <>
                    <Text className='font-normal text-lg'>{userDetails.employer}</Text>
                </> : 
                <>
                    <Text className='font-normal text-lg'>-</Text>
                </>}

                <Text className='font-semibold text-lg mt-5'>Matching Rate</Text>
                {userDetails.matching_rate ? 
                <>
                    <Text className='font-normal text-lg'>${userDetails.matching_rate}/hr</Text>
                </> : 
                <>
                    <Text className='font-normal text-lg'>-</Text>
                </>}

            </View>

            {/* <CustomButton
                title='Log Out'
                handlePress={submit}
                containerStyles='bg-rose-700'
                isLoading={isSubmitting}
                textStyles='text-base font-medium text-white'
            /> */}
        </ScrollView>
    </SafeAreaView>
  )
}

export default Profile