import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import BackButton from '@/components/BackButton';

const ViewTaskDetails = () => {
    const { taskID, user_first_name, user_last_name, start_date, end_date, taskName, desc, taskStatus, approver_first_name, approver_last_name, text_response, approver_update_date, submittedDate } = useLocalSearchParams();

    console.log("START DATE: ", start_date)
    console.log("END DATE: ", end_date)
    console.log("APPROVER DATE: ", approver_update_date)
    console.log("SUB DATE: ", submittedDate);

    // Options for formatting
    const TimeOption: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    };

    const dateReadable = (date: any, options: Intl.DateTimeFormatOptions) => {
        if (date.endsWith(" 00:00")) {
            date = date.replace(" 00:00", "Z")
        }
        const dateObject = new Date(date);
        return dateObject.toLocaleDateString('en-US', options);
    }

    return (
        <SafeAreaView className='h-full ml-5'>
            <BackButton/>
            <Text className="text-2xl font-bold pb-2">Task Details</Text>
            <ScrollView 
                className='flex'
                indicatorStyle='black'>
                <View>
                    <Text className='font-semibold text-lg mt-5'>Volunteer First Name</Text>
                    <Text className='font-normal text-lg'>{user_first_name}</Text>
                    
                    <Text className='font-semibold text-lg mt-5'>Volunteer Last Name</Text>
                    <Text className='font-normal text-lg'>{user_last_name}</Text>

                    <Text className='font-semibold text-lg mt-5'>Task Name</Text>
                    <Text className='font-normal text-lg'>{taskName}</Text>

                    <Text className='font-semibold text-lg mt-5'>Task Description</Text>
                    <Text className='font-normal text-lg'>{desc}</Text>

                    <Text className='font-semibold text-lg mt-5'>Task Status</Text>
                    <Text className='font-normal text-lg'>{taskStatus}</Text>

                    <Text className='font-semibold text-lg mt-5'>Task Start Date</Text>
                    <Text className='font-normal text-lg'>{dateReadable(start_date, TimeOption)}</Text>

                    <Text className='font-semibold text-lg mt-5'>Task End Date</Text>
                    <Text className='font-normal text-lg'>{dateReadable(end_date, TimeOption)}</Text>

                    <Text className='font-semibold text-lg mt-5'>Task Submitted Date</Text>
                    <Text className='font-normal text-lg'>{dateReadable(submittedDate, TimeOption)}</Text>

                    <Text className='font-semibold text-lg mt-5'>Approver First Name</Text>
                    {approver_first_name && approver_first_name != "null" ? 
                    <>
                        <Text className='font-normal text-lg'>{approver_first_name}</Text>
                    </> : 
                    <>
                        <Text className='font-normal text-lg'>-</Text>
                    </>}

                    
                    <Text className='font-semibold text-lg mt-5'>Approver Last Name</Text>
                    {approver_last_name && approver_first_name != "null" ? 
                    <>
                        <Text className='font-normal text-lg'>{approver_last_name}</Text>
                    </> : 
                    <>
                        <Text className='font-normal text-lg'>-</Text>
                    </>}

                    <Text className='font-semibold text-lg mt-5'>Approver Update Date</Text>
                    {approver_update_date && approver_first_name != "null" ? 
                    <>
                        <Text className='font-normal text-lg'>{dateReadable(approver_update_date, TimeOption)}</Text>
                    </> : 
                    <>
                        <Text className='font-normal text-lg'>-</Text>
                    </>}

                    <Text className='font-semibold text-lg mt-5'>Approver Response</Text>
                    {text_response && approver_first_name != "null" ? 
                    <>
                        <Text className='font-normal text-lg'>{text_response}</Text>
                    </> : 
                    <>
                        <Text className='font-normal text-lg'>-</Text>
                    </>}

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewTaskDetails