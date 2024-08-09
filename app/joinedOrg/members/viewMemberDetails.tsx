import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { signOutAccountDeleteSession, getOrganizations, acceptUserOrgJoinRequest, leaveOrg } from '@/appwrite_backend/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';
import { Snackbar } from 'react-native-paper';

const ViewMemberDetails = () => {
    const { userID, orgID, username, first_name, last_name, phone_num, email, employer, matching_rate, status, hideButtons} = useLocalSearchParams();
    const { userDetails } = useAppwriteContext();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hideButtonBool, setHideButtonBool] = useState(true)

    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const onDismissSnackBar = () => setSnackbarVisible(false);
    const [snackbarText, setSnackbarText] = useState("")

    const acceptUser = async (userID: any, orgID: any, username: any, privilege: any) => {
        await acceptUserOrgJoinRequest(userID, orgID, privilege)
        setSnackbarText(`Successfully accepted ${username}`);
        setSnackbarVisible(true);
    }

    const kickUser = async (userID: any, orgID: any, username: any) => {
        await leaveOrg(userID, orgID)
        setSnackbarText(`Successfully kicked ${username}`);
        setSnackbarVisible(true);
      }

    const declineUser = async (userID: any, orgID: any, username: any) => {
        await leaveOrg(userID, orgID)
        setSnackbarText(`Successfully declined ${username}`);
        setSnackbarVisible(true);
      }

    useEffect(() => {
        setHideButtonBool((hideButtons === 'true'))
    }, [])

    console.log("hidebuttonbool: ", hideButtonBool);
    console.log("privilege: ", status);

  return (
    <SafeAreaView className='h-full'>
        <View className='flex flex-row justify-between mx-5'>
            <BackButton></BackButton>
            {!hideButtonBool ? 
                status == "accepted" ?
                <>
                    <CustomButton
                        title='remove'
                        handlePress={() => {
                            kickUser(userID, orgID, username);
                        }}
                        containerStyles='my-5 px-5 bg-rose-700 rounded-full h-8 justify-center items-center'
                        textStyles='text-white'
                    >  
                    </CustomButton>
                </>
                : 
                <>
                    <View className='flex flex-row'>
                        <CustomButton
                            title='accept'
                            handlePress={() => {
                                acceptUser(userID, orgID, username, "volunteer") // currently just accepting any as level "volunteer"
                            }}
                            containerStyles='my-5 px-5 bg-green-700 rounded-full h-8 justify-center items-center mr-5'
                            textStyles='text-white'
                        >  
                        </CustomButton>
                        <CustomButton
                            title='decline'
                            handlePress={() => {
                                declineUser(userID, orgID, username);
                            }}
                            containerStyles='my-5 px-5 bg-rose-700 rounded-full h-8 justify-center items-center'
                            textStyles='text-white'
                        >  
                        </CustomButton>
                    </View>
                </>
                : <></> }
        </View>
        <ScrollView className='flex m-5'>
            <View className='flex flex-row justify-between'>
                <Text className="text-2xl font-bold">
                    {username === userDetails.username ? username + " (You)" : username}
                </Text>
            </View>
            <View>
                <Text className='font-semibold text-lg mt-5'>First Name</Text>
                <Text className='font-normal text-lg'>{first_name}</Text>
                
                <Text className='font-semibold text-lg mt-5'>Last Name</Text>
                <Text className='font-normal text-lg'>{last_name}</Text>
                
                <Text className='font-semibold text-lg mt-5'>Phone Number</Text>
                <Text className='font-normal text-lg'>{phone_num}</Text>
                
                <Text className='font-semibold text-lg mt-5'>Email</Text>
                <Text className='font-normal text-lg'>{email}</Text>

                <Text className='font-semibold text-lg mt-5'>Employer</Text>
                {employer ? 
                <>
                    <Text className='font-normal text-lg'>{employer}</Text>
                </> : 
                <>
                    <Text className='font-normal text-lg'>-</Text>
                </>}

                <Text className='font-semibold text-lg mt-5'>Matching Rate</Text>
                {matching_rate ? 
                <>
                    <Text className='font-normal text-lg'>${matching_rate}/hr</Text>
                </> : 
                <>
                    <Text className='font-normal text-lg'>-</Text>
                </>}

            </View>
        </ScrollView>
        <Snackbar
            visible={snackbarVisible}
            onDismiss={onDismissSnackBar}
            action={{
                label: 'Back to Members',
                onPress: () => {
                    router.back();
                },
                labelStyle: {color: 'white', fontWeight: 'bold'}
                }}
            >
                {snackbarText}
        </Snackbar>
    </SafeAreaView>
  )
}

export default ViewMemberDetails