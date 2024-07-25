import { View, Text, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '@/appwrite_backend/useAppwrite';
import { getOrgTasks, requestJoinOrg, submitActivity, leaveOrg } from '@/appwrite_backend/service';
import Loading from '@/components/Loading';
import CustomButton from '@/components/CustomButton';
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';
import BackButton from '@/components/BackButton';

const Orgs = () => {
    const { user, setUser, setIsSignedIn} = useAppwriteContext();
    // const [loading, setLoading] = useState(true);
    const { orgName, orgDesc, orgID } = useLocalSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [isLoading, seIsLoading] = useState(false);

    console.log("orgName: ", orgName);
    console.log("orgID: ", orgID);

    // const { data: result, isLoading } = useAppwrite(
    //     () => getOrgTasks(orgID)
    // );

    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const onDismissSnackBar = () => setSnackbarVisible(false);
    const [snackbarText, setSnackbarText] = useState("")

    useFocusEffect(
        useCallback(() => {
            const showLeftMsg = async () => {
                const shouldShowMsg = await AsyncStorage.getItem('activitySubmitted');
                console.log("GET ITEM IN useFocusEffect: ", shouldShowMsg);
                if (shouldShowMsg) {
                    await AsyncStorage.removeItem('activitySubmitted')
                    setSnackbarText(shouldShowMsg);
                    setSnackbarVisible(true);
                }
              }
          
              showLeftMsg();
        }, [])
      );

    // useEffect(() => {
    //     const showLeftMsg = async () => {
    //       const shouldShowMsg = await AsyncStorage.getItem('activitySubmitted');
    //       console.log("GET ITEM IN USEEFFECT: ", shouldShowMsg);
    //       if (shouldShowMsg) {
    //           await AsyncStorage.removeItem('activitySubmitted')
    //           setSnackbarText(shouldShowMsg);
    //           setSnackbarVisible(true);
    //       }
    //     }
    
    //     showLeftMsg();
    //   }, [])


    const submitTimesheet = async () => {
        try {
            setIsSubmitting(true);


            // const result = await submitActivity(user["userId"], orgID, "dummy desc")
            // console.log("Request Join Result: ", result)
            console.log(`joinedOrg/timesheet/${orgName}?orgID=${orgID}`)
            router.push(`joinedOrg/timesheet/${orgName}?orgID=${orgID}`)


        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const viewTimesheet = async () => {
        try {
            setIsSubmitting(true);


            // const result = await submitActivity(user["userId"], orgID, "dummy desc")
            // console.log("Request Join Result: ", result)
            console.log(`joinedOrg/submitted/${orgName}?orgID=${orgID}`)
            router.push(`joinedOrg/submitted/${orgName}?orgID=${orgID}`)


        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const leave = async () => {
        try {
            setIsSubmitting(true);
            const result = await leaveOrg(user["userId"], orgID);
            console.log("Leave Org Result: ", result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
            await AsyncStorage.setItem("leftOrgMsg", String(orgName));
            router.back();
        }
    }

    return (
        <SafeAreaView className='h-full mx-5'>
            <BackButton>
            </BackButton>
            <ScrollView>
            <Text className='mt-5 font-bold text-3xl'>{orgName}</Text>
                {isLoading == true 
                ? 
                    <Loading></Loading> 
                : 
                    <>
                        {/* <Text className='text-2xl'>{result}</Text> */}
                        <Text className='text-lg mt-2'>{orgDesc}</Text>
                        {/* <Text className='text-1xl'>{orgID}</Text> */}
                        <CustomButton
                            title='Submit Timesheet'
                            handlePress={submitTimesheet}
                            containerStyles='mt-7 bg-black'
                            isLoading={isSubmitting}
                            textStyles='text-base font-medium text-white'
                        />
                        <CustomButton
                            title='View Submitted Timesheets'
                            handlePress={viewTimesheet}
                            containerStyles='mt-7 bg-black'
                            isLoading={isSubmitting}
                            textStyles='text-base font-medium text-white'
                        />
                        <CustomButton
                            title='Leave Organization'
                            handlePress={leave}
                            containerStyles='mt-40 bg-rose-700'
                            isLoading={isSubmitting}
                            textStyles='text-base font-medium text-white'
                        />
                    </>
                }
            </ScrollView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={onDismissSnackBar}>
                {snackbarText}
            </Snackbar>
        </SafeAreaView>
    )
}

export default Orgs