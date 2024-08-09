import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { decideTimesheet, deleteActivity, getAllSubmittedActivities, getSubmittedActivities } from '@/appwrite_backend/service'
import useAppwrite from '@/appwrite_backend/useAppwrite';
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskItem from '@/components/TaskItem';
import Loading from '@/components/Loading';
import SwitchSelector from "react-native-switch-selector";
import BackButton from '@/components/BackButton';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '@/components/CustomButton';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Papa from 'papaparse';
import FormFieldTextArea from '@/components/FormFieldTextArea';

const SubmittedActivities = () => {
    const { user, userDetails } = useAppwriteContext();
    const { orgName, orgID } = useLocalSearchParams();
    const { data: activities, isLoading, refetch } = useAppwrite(() => getAllSubmittedActivities(orgID))
    const [selectedStatus, setSelectedStatus] = useState<string>("pending")

    console.log("SubmittedActivities ([orgName].tsx): ", activities);
    
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const onDismissSnackBar = () => setSnackbarVisible(false);
    const [snackbarText, setSnackbarText] = useState("")

    const onRefresh = async () => {
        // refresh
        await refetch();
    }

    useFocusEffect(
        useCallback(() => {
            const showEditMsg = async () => {
                const shouldEditMsg = await AsyncStorage.getItem('timesheetEdited');
                console.log("GET ITEM IN useFocusEffect: ", shouldEditMsg);
                if (shouldEditMsg) {
                    await AsyncStorage.removeItem('timesheetEdited')
                    setSnackbarText(shouldEditMsg);
                    setSnackbarVisible(true);
                }
              }
          
              showEditMsg();
            onRefresh();
        }, [])
      );

    // Options for formatting
    const TimeOption: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    const noTimeOption: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const dateReadable = (date: string, options: Intl.DateTimeFormatOptions) => {
        const dateObject = new Date(date);
        return dateObject.toLocaleDateString('en-US', options);
    }

    const taskStatusOptions = [
        { label: "Pending", value: "pending",},
        { label: "Approved", value: "approved"},
        { label: "Rejected", value: "rejected"}
      ];

    const updateTimesheetDecision = async (timesheetID: any, decision: string) => {
        if (decision === "approved")
        {
            setSnackbarText("Successfully approved timesheet");
            await decideTimesheet(timesheetID, user.userId, userDetails.first_name, userDetails.last_name, "", decision);
        }
        else if (decision === "rejected")
        {
            setSnackbarText("Successfully rejected timesheet");
            await decideTimesheet(timesheetID, user.userId, userDetails.first_name, userDetails.last_name, "", decision);
        }
        else {
            setSnackbarText("There was an error, try again");  
        }
        await refetch();
        setSnackbarVisible(true);
    }

    const handleExportCsv = async () => {
        try {

        // Type for timesheet data 
        type DataItem = {
            desc:any,
            userID:any,
            orgID:any,
            taskName:any,
            start_date:any,
            end_date: any,
            taskStatus: any,
            submittedDate: any,
            $updatedAt: any,
        }

        // Fields and their mappings to include in the CSV
        const fieldNames: { [key in keyof DataItem]?: string } = {
            desc:'Description', 
            userID:'User ID',
            orgID:'Organization ID',
            taskName:'Task',
            start_date:'Start Date',
            end_date: 'End Date',
            taskStatus: 'Task Status',
            submittedDate: 'Submitted Date',
            $updatedAt: 'Updated Date'
        };

        // New list of objects with renamed keys
        const mappedData = activities.map((item : any) => {
            const mappedItem: { [key: string]: any } = {};
            for (const key in item) {
              if (fieldNames[key as keyof DataItem]) {
                mappedItem[fieldNames[key as keyof DataItem]!] = item[key as keyof DataItem];
              }
            }
            return mappedItem;
          });

        // Convert JSON to CSV
        const csv = Papa.unparse(mappedData);

        // Define file path
        const fileUri = FileSystem.documentDirectory + 'timesheets.csv';

        // Write CSV file to file system
        await FileSystem.writeAsStringAsync(fileUri, csv);

        // Open share menu
        await Sharing.shareAsync(fileUri);
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    };
    
    return (
        <SafeAreaView className='h-full'>
            <View className='flex flex-row justify-between mx-5'>
                <BackButton></BackButton>
                <CustomButton
                    title='Export Data'
                    handlePress={handleExportCsv}
                    containerStyles='my-5 px-5 bg-cyan-500 rounded-full h-8 justify-center items-center'
                    textStyles='text-white'
                >
                </CustomButton>
            </View>
            {/* {isLoading === true ? <Loading></Loading> : <></>} */}
            <View className='flex items-left mt-1 mb-6 ml-5'>
                <Text className='text-3xl font-bold text-black'>Manage Timesheets</Text>
            </View>
            <View className='mx-10'>
                <SwitchSelector
                    options={taskStatusOptions}
                    initial={0}
                    onPress={(value: any) => setSelectedStatus(value)}
                    buttonColor={'#000000'}
                
                />
            </View>
            <FlatList
                data={activities.filter((item: any) => item.taskStatus === selectedStatus)}
                keyExtractor={(item : any) => item.$id}
                renderItem={({item}) => (
                    <TaskItem
                        taskID={item.$id}
                        taskName={item.taskName}
                        handlePress={() => {
                            // console.log(item);
                            // router.push(`joinedOrg/submitted/view/${item.$id}`)
                        }}
                        deletePress={() => {
                            deleteActivity(item.$id)
                            onRefresh();
                            setSnackbarText("Successfully deleted timesheet");
                            setSnackbarVisible(true);
                        }}
                        editPress={() => {
                            router.push(`joinedOrg/submitted/edit/${item.$id}?taskName=${item.taskName}&taskDesc=${item.desc}&startDate=${item.start_date}&endDate=${item.end_date}&orgID=${orgID}`)
                        }}
                        taskStatus={item.taskStatus}
                        subDate={dateReadable(item.submittedDate, TimeOption)}
                        startDate={item.start_date}
                        endDate={item.end_date}
                        desc={item.desc}
                        username={item.user_first_name + " " + item.user_last_name}
                        approvePress={() => updateTimesheetDecision(item.$id, "approved")}
                        rejectPress={() => updateTimesheetDecision(item.$id, "rejected")}
                        approver_first_name={item.approver_first_name}
                        approver_last_name={item.approver_last_name}
                        approver_update_date={item.approver_update_date ? dateReadable(item.approver_update_date, noTimeOption) : item.approver_update_date}
                    >
                    </TaskItem>
                )}
                ListEmptyComponent={
                    <View className='flex justify-center items-center mt-6'>
                        <Text className='text-lg text-black'>There are no {selectedStatus} items.</Text>
                    </View>}
                refreshControl={
                    <RefreshControl 
                    refreshing={false} // I commented this to hide the refreshing animation it did every time we navigated back to this screen
                    onRefresh={onRefresh}/>
                    }
            >
            </FlatList>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={onDismissSnackBar}
                // action={{
                //     label: 'Refresh',
                //     onPress: () => {
                //         onRefresh();
                //     },
                //     labelStyle: {color: 'white', fontWeight: 'bold'}
                //     }}
                >
                {snackbarText}
            </Snackbar>
            
        </SafeAreaView>
    )
}

const containerStyle = {
    backgroundColor: 'white', 
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
    height: 200,
};

export default SubmittedActivities