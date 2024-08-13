import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton';

type AddedTaskItemProps = {
    taskName?: string,
    deletePress?: (() => any),
}

const AddedTaskItem = ({taskName, deletePress} : AddedTaskItemProps) => {
    const maxTaskLength = 25;
    return (
    <View className='bg-white p-5 rounded-md m-4'>
        <View className='flex flex-row justify-between'>
        <Text className='text-lg font-bold'>{taskName}</Text>
        </View>
        <View className='h-1 bg-slate-100 my-1 mb-2 rounded-md'></View>
        <View className='flex flex-row justify-end'>
            <CustomButton
                title='delete'
                textStyles='mt-1 text-rose-700'
                handlePress={deletePress}
                containerStyles='h-5'
            >
            </CustomButton>
        </View>
    </View>
  );
};

export default AddedTaskItem