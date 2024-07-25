import { View, Text, TextInput, ScrollView, Alert, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getOrgTasks, submitActivity, updateActivity } from '@/appwrite_backend/service'
import useAppwrite from '@/appwrite_backend/useAppwrite';
import { router, useLocalSearchParams } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import Loading from '@/components/Loading';
import { useForm } from 'react-hook-form'
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import FormFieldTextArea from '@/components/FormFieldTextArea';
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";

type TimeSheetFormFields = {
    desc: string,
    taskName: string,
    start_date: string,
    end_date: string
}

const EditTimesheet = () => {
    const [form, setForm] = useState<TimeSheetFormFields>({
        desc: '',
        taskName: '',
        start_date: '',
        end_date: ''
    })

    // Snackbar states
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const onDismissSnackBar = () => setSnackbarVisible(false);
    const [snackbarText, setSnackbarText] = useState("")

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [taskValue, setTaskValue] = useState(null);
    
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [startD, setStartD] = useState<Date>(new Date());
    const [startT, setStartT] = useState<Date>(new Date());
    const [endD, setEndD] = useState<Date>(new Date());
    const [endT, setEndT] = useState<Date>(new Date());

    const [dropdownFocus, setDropdownFocus] = useState(false)
    
    const { user } = useAppwriteContext();
    const { taskID, taskName, taskDesc, startDate, endDate, orgID} = useLocalSearchParams();

    console.log("user: ", user.userId);
    console.log("taskID: ", taskID);
    console.log("taskName: ", taskName);
    console.log("taskDesc: ", taskDesc);
    console.log("startDate: ", startDate);
    console.log("endDate: ", endDate)
    console.log("orgID: ", orgID)
    

    useEffect(() => {
        form.desc = String(taskDesc);
    }, [])
    

    const { data: tasks, isLoading, refetch  } = useAppwrite(() => getOrgTasks(orgID));
    const exists = tasks.some((task: any) => task.taskName === taskName);
    if (!exists) {
        tasks.push({"taskName": taskName});
    }

    const combineDate = (date: Date, time: Date) => {
        const datePart = new Date(date);
        const timePart = new Date(time);
    
        // Set the hours, minutes, seconds, and milliseconds from timePart to datePart
        datePart.setHours(timePart.getHours());
        datePart.setMinutes(timePart.getMinutes());
        datePart.setSeconds(timePart.getSeconds());
        datePart.setMilliseconds(timePart.getMilliseconds());
        
        return datePart;
    }

    // Options for formatting
    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };

    const dateReadable = (date: string) => {
        const dateObject = new Date(date);
        return dateObject.toLocaleDateString('en-US', dateOptions);
    }

    const timeReadable = (date: string) => {
        const dateObject = new Date(date);
        return dateObject.toLocaleTimeString('en-US', timeOptions);
    }

    const submit = async () => {
        const start_date = combineDate(startD, startT);
        const end_date = combineDate(endD, endT);
        const cur_date: Date = new Date();
        if (!form.desc || 
            !taskValue
        ) {
          Alert.alert("Empty Fields", "Please select a task and enter a description");
        }
        else if (start_date >= end_date) {
            Alert.alert("Incorrect Dates", "The start date must be before the end date");
        }
        else if (cur_date <= start_date || cur_date <= end_date) {
            Alert.alert("Incorrect Dates", "The start and end dates cannot be in the future")
        }
        else {
            try {
                setIsSubmitting(true);
                console.log("START DATE: ", start_date);
                console.log("END DATE: ", end_date);
                
                await updateActivity(taskID, user.userId, orgID, taskValue, form.desc, start_date.toISOString(), end_date.toISOString());
                await AsyncStorage.setItem("timesheetEdited", "Successfully edit timesheet!");
                router.back();
            } catch (error) {
                console.log("timesheet/[orgName].tsx: submitTimesheet(): ", error);
                setSnackbarText("Oops, there was an error. Try again.")
                setSnackbarVisible(true);
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    const setStartDate = (event: DateTimePickerEvent, date: any) => {
        setShowDatePicker(false);
        const {
          type,
          nativeEvent: {timestamp, utcOffset},
        } = event;
        console.log("START DATE: ", date);
        setStartD(date);
      };
    
      const setStartTime = (event: DateTimePickerEvent, date: any) => {
        setShowDatePicker(!showDatePicker);
        const {
          type,
          nativeEvent: {timestamp, utcOffset},
        } = event;
        console.log("START TIME: ", date);
        setStartT(date);
      };

      const setEndDate = (event: DateTimePickerEvent, date: any) => {
        setShowDatePicker(false);
        const {
          type,
          nativeEvent: {timestamp, utcOffset},
        } = event;
        console.log("END DATE: ", date);
        setEndD(date);
      };

      const setEndTime = (event: DateTimePickerEvent, date: any) => {
        setShowDatePicker(!showDatePicker);
        const {
          type,
          nativeEvent: {timestamp, utcOffset},
        } = event;
        console.log("END TIME: ", date);
        setEndT(date);
      };

      const onChange = (event: DateTimePickerEvent, selectedDate: any, fn: (...any: any[]) => any) => {
        const currentDate = selectedDate || startT;
        setShowDatePicker(Platform.OS === 'ios');
        fn(currentDate);
      };
      
      const showDatepicker = (mode: any, fn: (...any: any[]) => any) => {
        if (Platform.OS === 'android') {
          DateTimePickerAndroid.open({
            value: startT,
            onChange: (event, selectedDate) => onChange(event, selectedDate, fn),
            mode: mode,
            is24Hour: false,
          });
        } else {
            setShowDatePicker(true);
        }
      };

  return (
    <SafeAreaView>
        <Text className="text-2xl font-bold mt-6 ml-5">
            Enter Information
        </Text>
        <ScrollView className='h-full'>
            {isLoading == true
            ?
            <Loading></Loading>
            : 
            <>
                <View
                    className='mx-5'>
                    <Text className="text-base font-medium">
                        Select Task
                    </Text>
                    <View>
                        <Dropdown
                            data={tasks}
                            labelField="taskName"
                            valueField="taskName"
                            placeholder='Choose Task'
                            onFocus={() => setDropdownFocus(true)}
                            onBlur={() => setDropdownFocus(false)}
                            onChange={item => {
                                setTaskValue(item.taskName)
                                setDropdownFocus(false);
                            }}
                            placeholderStyle={styles.placeholder}
                            style={[styles.dropdown, dropdownFocus && { borderColor: 'black' }]}
                        ></Dropdown>
                    </View>
                </View>
                <View
                className='mx-5 mt-5'>
                    <Text className="text-base font-medium">
                        Description
                    </Text>
                    <FormFieldTextArea
                        placeholder='What did you do?' 
                        title=''
                        value={form.desc}
                        handleChangeText={(e) => setForm({...form, desc: e})}
                        
                    />
                </View>

                {/* iOS Specific: */}
                {Platform.OS === 'ios' && (<View className='mx-5 mt-5'>
                    <View className='items-start'>
                        <Text className="text-base font-medium">Start Date</Text>
                        <RNDateTimePicker
                            value={startD}
                            mode='date'
                            onChange={setStartDate}
                            themeVariant="light"
                        ></RNDateTimePicker>
                    </View>            
                    <View className='mt-5'>
                        <Text className="text-base font-medium">Start Time</Text>
                        {/* <CustomButton
                            title={timeReadable(startT.toISOString())}
                            handlePress={() => setShowDatePicker(!showDatePicker)}
                        ></CustomButton> */}
                        {/* {showDatePicker === true
                        ? */}
                        <RNDateTimePicker
                            value={startT}
                            mode='time'
                            onChange={setStartTime}
                            themeVariant="light"
                            display="spinner"
                            style={{height: 90}}
                        ></RNDateTimePicker>
                        {/* : 
                        <></>} */}
                    </View>         
                    <View className='mt-5 items-start'>
                        <Text className="text-base font-medium">End Date</Text>
                        <RNDateTimePicker
                            value={endD}
                            mode='date'
                            onChange={setEndDate}
                            themeVariant="light"
                        ></RNDateTimePicker>
                    </View>         
                    <View className='mt-5'>
                        <Text className="text-base font-medium">End Time</Text>
                        <RNDateTimePicker
                            value={endT}
                            mode='time'
                            onChange={setEndTime}
                            themeVariant="light"
                            display="spinner"
                            style={{height: 90}}
                        ></RNDateTimePicker>
                    </View>         
                </View>)}

                {/* Android Specific: */}
                {Platform.OS === 'android' && (<View className='mx-5 mt-5'>
                    <View className=''>
                        <Text className='text-base font-medium mb-1'>Start Date</Text>
                        <CustomButton
                            title={dateReadable(startD.toISOString())}
                            handlePress={() => {
                                showDatepicker('date', setStartD)
                            }}
                            containerStyles='border border-black'
                        ></CustomButton>
                    </View>

                    <View className=''>
                        <Text className='text-base font-medium mb-1 mt-4'>Start Time</Text>
                        <CustomButton
                            title={timeReadable(startT.toISOString())}
                            handlePress={() => {
                                setShowDatePicker(!showDatePicker)
                                showDatepicker('time', setStartT)}}
                            containerStyles='border border-black'
                        ></CustomButton>
                    </View>

                    <View className=''>
                        <Text className='text-base font-medium mb-1 mt-4'>End Date</Text>
                        <CustomButton
                            title={dateReadable(endD.toISOString())}
                            handlePress={() => {
                                setShowDatePicker(!showDatePicker)
                                showDatepicker('date', setEndD)}}
                            containerStyles='border border-black'
                        ></CustomButton>
                    </View>

                    <View className=''>
                        <Text className='text-base font-medium mb-1 mt-4'>End Time</Text>
                        <CustomButton
                            title={timeReadable(endT.toISOString())}
                            handlePress={() => {
                                setShowDatePicker(!showDatePicker)
                                showDatepicker('time', setEndT)}}
                            containerStyles='border border-black'
                        ></CustomButton>
                    </View>
                </View>)}

                {/* {Platform.OS === 'ios' && showDatePicker === true && (
                    <RNDateTimePicker
                        value={endT}
                        mode='time'
                        onChange={(_: DateTimePickerEvent, date: any) => {
                            setEndT(date);
                        }}
                    ></RNDateTimePicker>    
                )} */}

                <View className='mx-5 mt-10'>
                    <CustomButton
                            title='Save Changes'
                            handlePress={submit}
                            containerStyles='bg-black'
                            isLoading={isSubmitting}
                            textStyles='text-base font-medium text-white '
                    />
                </View>
                {isSubmitting == true ? <Loading></Loading> : <></>}
            </>}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={onDismissSnackBar}>
                {snackbarText}
            </Snackbar>
        </ScrollView>
    </SafeAreaView>
  )
}

export default EditTimesheet

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
    placeholder: {
        color: 'gray',
    }
});