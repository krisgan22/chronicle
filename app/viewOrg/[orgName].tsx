import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '@/appwrite_backend/useAppwrite';
import { getOrgTasks, requestJoinOrg } from '@/appwrite_backend/service';
import Loading from '@/components/Loading';
import CustomButton from '@/components/CustomButton';
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { Snackbar } from 'react-native-paper'
import BackButton from '@/components/BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Orgs = () => {
    const { user, setUser, setIsSignedIn} = useAppwriteContext();
    // const [loading, setLoading] = useState(true);
    const { orgName, orgDesc, orgID } = useLocalSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [snackbarText, setSnackbarText] = useState("")
    const [buttonText, setButtonText] = useState("Request to Join")

    const [isLoading, setIsLoading] = useState(false);

    // const { data: result, isLoading } = useAppwrite(
    //     () => getOrgTasks(orgID)
    // );
    useEffect(() => {
        const triedJoining = async () =>
        {
            const joined = await AsyncStorage.getItem(`join_${user["userId"]}.${orgID}`);
            if (joined) {
                setIsSubmitting(true);
                setButtonText("Requested")
            }
        }

        triedJoining();
    }, [])
    

    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const onDismissSnackBar = () => setSnackbarVisible(false);

    const submit = async () => {
        try {
            setIsSubmitting(true);
            const joinRequestResult = await requestJoinOrg(user["userId"], orgID);
            if (!joinRequestResult)
            {
                setSnackbarText("You have already requested to join this organization!")
                setSnackbarVisible(true);
            } else if (joinRequestResult) {
                setSnackbarText("Your request was sent!")
                setSnackbarVisible(true);
                await AsyncStorage.setItem(`join_${user["userId"]}.${orgID}`, "true");
                setButtonText("Requested")
            }
            // Remove from Async Storage
            // console.log("USERID: ", user["userId"]);
            console.log("Request Join Result: ", joinRequestResult)
        } catch (error) {
            console.error(error);
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
                            title={buttonText}
                            handlePress={submit}
                            containerStyles='mt-20 bg-black'
                            isLoading={isSubmitting}
                            textStyles='text-base font-medium text-white'
                        />
                    </>
                }
            </ScrollView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={onDismissSnackBar}
                action={{
                label: 'Back to Search',
                onPress: () => {
                    router.back();
                },
                labelStyle: {color: 'white', fontWeight: 'bold'}
                }}>
                {snackbarText}
            </Snackbar>
        </SafeAreaView>
    )
}

const styles = {
    app: {
      flex: 4, // the number of columns you want to divide the screen into
      marginHorizontal: "auto",
      width: 400,
      backgroundColor: "red"
    },
    row: {
      flexDirection: "row"
    },
    "1col":  {
      backgroundColor:  "lightblue",
      borderColor:  "#fff",
      borderWidth:  1,
      flex:  1
    },
    "2col":  {
      backgroundColor:  "green",
      borderColor:  "#fff",
      borderWidth:  1,
      flex:  2
    },
    "3col":  {
      backgroundColor:  "orange",
      borderColor:  "#fff",
      borderWidth:  1,
      flex:  3
    },
    "4col":  {
      flex:  4
    }
  };

export default Orgs