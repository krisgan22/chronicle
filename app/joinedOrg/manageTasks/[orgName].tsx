import { View, Text, FlatList, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import useAppwrite from '@/appwrite_backend/useAppwrite';
import { getOrgTasks, setOrgTasks } from '@/appwrite_backend/service';
import AddedTaskItem from '@/components/AddedTaskItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import CustomButton from '@/components/CustomButton';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import CreateTaskBottomSheetModal from '@/components/CreateTaskBottomSheetModal';
import { Snackbar } from 'react-native-paper';


const manageTasks = () => {
    const { orgName, orgID } = useLocalSearchParams();
    const [refreshing, setRefreshing] = useState(false);
    const { data: tasks, setData: setTasks, refetch } = useAppwrite(() => getOrgTasks(orgID));

    const addTask = async (taskName: string) => {
        console.log("TASKS", tasks);
        tasks.push({taskName: taskName, id: tasks.length});
        console.log("TASK ADDED", tasks);
        await updateTaskList(tasks);
    }

    const delTask = async (index: any) => {
        console.log("TASKS", tasks);
        const res = tasks.filter((task: any) => task.id != index)
        console.log("TASK DEL", res);
        await updateTaskList(res);
        // console.log("RES", tasks);
        // setTasks(res);
    }

    const updateTaskList = async (newTasks: any) => {
        try {
            const taskList = newTasks.map((task : any) => (task.taskName));
            const result = await setOrgTasks(orgID, taskList);
            console.log("RESULT: ", result);
            await onRefresh();
        } catch (error) {
            console.log()
        }
    }
    
    const onRefresh = async () => {
        setRefreshing(true);

        // refresh
        await refetch();

        setRefreshing(false);
    }

    const createTaskModalRef = useRef<BottomSheetModal>(null);
    const { dismiss } = useBottomSheetModal();
    const handlePresentCreateTaskModalPress = () => {
        createTaskModalRef.current?.present();
    }

    const [taskName, setTaskName] = useState("")

    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const onDismissSnackBar = () => setSnackbarVisible(false);
    const [snackbarText, setSnackbarText] = useState("")

    return (
    <SafeAreaView className='h-full'>
        <View className='flex flex-row justify-between mx-5'>
            <BackButton></BackButton>
            <CustomButton
                handlePress={handlePresentCreateTaskModalPress}
                title='Add Task'
                containerStyles='my-5 px-5 bg-green-500 rounded-full h-8 justify-center items-center'
                textStyles='text-white'
            />
        </View>
        <View className='flex items-left mt-1 mb-6 ml-5'>
            <Text className='text-3xl font-bold text-black'>Manage Tasks</Text>
        </View>
        <FlatList
            data={tasks}
            keyExtractor={(item : any) => item.id}
            renderItem={({item}) => (
                <AddedTaskItem
                    taskName={item.taskName}
                    deletePress={() => {
                        delTask(item.id)
                        setSnackbarText("Successfully deleted Task");
                        setSnackbarVisible(true);
                    }}
                >
                </AddedTaskItem>
            )}
        >
        </FlatList>
        <Snackbar
            visible={snackbarVisible}
            onDismiss={onDismissSnackBar}
            >
            {snackbarText}
        </Snackbar>
        <CreateTaskBottomSheetModal
            ref={createTaskModalRef}
            textInput={taskName}
            handleTextInput={setTaskName}
            decisionPress={() => {
                if (taskName) {
                    addTask(taskName);
                    setTaskName("");
                    dismiss();
                    setSnackbarText("Successfully added Task");
                    setSnackbarVisible(true);
                } else {
                    Alert.alert("Please enter a name for the Task")
                }
            }}
        />
    </SafeAreaView>
    )
}

export default manageTasks