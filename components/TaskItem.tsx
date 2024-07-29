import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Task } from 'react-native';
import CustomButton from './CustomButton';

type TaskItemProps = {
    taskID: string,
    taskName: string,
    handlePress: (() => any),
    deletePress: (() => any),
    editPress: (() => any),
    taskStatus: string,
    subDate: string,
    startDate: string,
    endDate: string,
    desc: string,
}

const TaskItem = ({taskID, taskName, handlePress, deletePress, editPress, taskStatus, subDate, startDate, endDate, desc} : TaskItemProps) => {
  
    const maxTaskLength = 25;
    const startDateObject: Date = new Date(startDate);
    const endDateObject: Date = new Date(endDate);

    const taskDuration = endDateObject.getTime() - startDateObject.getTime();
        
    // Constants for time conversion
    const millisecondsInMinute = 1000 * 60;
    const millisecondsInHour = millisecondsInMinute * 60;

    const hours = Math.floor(taskDuration / millisecondsInHour);
    const minutes = Math.floor((taskDuration % millisecondsInHour) / millisecondsInMinute);

    // Format the result
    let durationString = ""
    if (hours > 0) {
        durationString = `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''}`;
    } else {
        durationString = `${minutes} min${minutes > 1 ? 's' : ''}`;
    }

    return (
    <View className='bg-white p-5 rounded-md m-4'>
      <View className='flex flex-row justify-between'>
        <View className='flex-1'>
            <Text className='text-lg font-bold'>{taskName.length > maxTaskLength ? taskName.substring(0, maxTaskLength) + '...' : taskName}</Text>
            <Text className='text-slate-400 leading-8 italic'>submitted {subDate}</Text>
        </View>
        <Text className={`leading-7 ${taskStatus == "pending" ? 'text-amber-500' : taskStatus == "approved" ? 'text-green-500' : 'text-rose-700'}`}>{taskStatus}</Text>
      </View>
      <View className='h-1 bg-slate-100 my-1 rounded-md'></View>
      <Text className='mt-1' numberOfLines={4}>{desc}</Text>
      <Text className='mt-2 text-slate-500'>{durationString}</Text>
      <View className='flex-row justify-end'>
        {taskStatus !== "approved" && (<>
        <CustomButton
          title='edit'
          textStyles='px-5 text-slate-600'
          handlePress={editPress}
          containerStyles='h-5'
        >
        </CustomButton>
        <CustomButton
          title='delete'
          textStyles='text-rose-700'
          handlePress={deletePress}
          containerStyles='h-5'
        >
        </CustomButton>
        </>)}
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 8,
//     marginVertical: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   taskName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   status: {
//     color: 'orange', // Change color based on status
//   },
//   submittedDate: {
//     fontStyle: 'italic',
//     color: '#666',
//   },
//   dateRange: {
//     marginTop: 5,
//     color: '#333',
//   },
//   description: {
//     marginTop: 5,
//     color: '#666',
//   },
// });

export default TaskItem;