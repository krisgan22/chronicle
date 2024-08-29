import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '@/appwrite_backend/useAppwrite';
import { getOrgTasks, requestJoinOrg, submitActivity, leaveOrg, getCurrentUserOrgPrivilege } from '@/appwrite_backend/service';
import Loading from '@/components/Loading';
import CustomButton from '@/components/CustomButton';
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';
import BackButton from '@/components/BackButton';
import { MaterialIcons } from '@expo/vector-icons';
import ConfirmModal from '@/components/ConfirmModal';

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

    const { data: privilege } = useAppwrite(() => getCurrentUserOrgPrivilege(user["userId"], orgID))

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
            await AsyncStorage.removeItem(`join_${user["userId"]}.${orgID}`);
            await AsyncStorage.setItem("leftOrgMsg", String(orgName));
            router.back();
        }
    }

    const viewUsers = async () => {
        try {
            setIsSubmitting(true);
            router.push(`joinedOrg/members/manageMembers?orgID=${orgID}&orgName=${orgName}`)

        } finally {
            setIsSubmitting(false);
        }
    }

    const viewMemberTimesheets = async () => {
        try {
            setIsSubmitting(true);
            router.push(`joinedOrg/manageSubmitted/${orgName}?orgID=${orgID}`)

        } finally {
            setIsSubmitting(false);
        }
    }

    const manageTasks = async () => {
        try {
            setIsSubmitting(true);
            router.push(`joinedOrg/manageTasks/${orgName}?orgID=${orgID}`)

        } finally {
            setIsSubmitting(false);
        }
    }

    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    return (
        <SafeAreaView className='h-full'>
            <ConfirmModal
                modalText='Are you sure you want to leave the organization?'
                handleSubmit={leave}
                confirmModalVisible={confirmModalVisible}
                setConfirmModalVisible={setConfirmModalVisible}
            >
            </ConfirmModal>
            <View className='mx-5'>
            <BackButton>
            </BackButton>
            <ScrollView>
            <View className='mt-5 flex-row justify-between'>
                <Text className='font-bold text-3xl'>{orgName}</Text>
                <TouchableOpacity 
                    onPress={() => setConfirmModalVisible(true)}
                    className='pt-1'
                    >
                    <MaterialIcons name="logout" size={24} color="#BE123C" />
                </TouchableOpacity>
            </View>
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
                            title='View My Timesheets'
                            handlePress={viewTimesheet}
                            containerStyles='mt-7 bg-indigo-700'
                            isLoading={isSubmitting}
                            textStyles='text-base font-medium text-white'
                        />
                        <CustomButton
                            title='Manage Members'
                            handlePress={viewUsers}
                            containerStyles='mt-7 bg-green-700'
                            isLoading={isSubmitting}
                            textStyles='text-base font-medium text-white'
                        />
                        {privilege !== null && privilege !== undefined && (privilege === "board_member" || privilege === "mentor") ?
                        <>
                            <CustomButton
                                title='Manage Member Timesheets'
                                handlePress={viewMemberTimesheets}
                                containerStyles='mt-7 bg-cyan-700'
                                isLoading={isSubmitting}
                                textStyles='text-base font-medium text-white'
                            />
                            <CustomButton
                                title='Manage Tasks'
                                handlePress={manageTasks}
                                containerStyles='mt-7 bg-fuchsia-700'
                                isLoading={isSubmitting}
                                textStyles='text-base font-medium text-white'
                            />
                        </>
                        :<></>}
                        {/* <CustomButton
                            title='Leave Organization'
                            handlePress={leave}
                            containerStyles='mt-20 bg-rose-700'
                            isLoading={isSubmitting}
                            textStyles='text-base font-medium text-white'
                        /> */}
                    </>
                }
            </ScrollView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={onDismissSnackBar}>
                {snackbarText}
            </Snackbar>
            </View>
        </SafeAreaView>
    )
}

export default Orgs