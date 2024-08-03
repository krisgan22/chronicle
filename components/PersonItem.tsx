import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { acceptUserOrgJoinRequest, leaveOrg } from '@/appwrite_backend/service'

type PersonItemProps = {
    username: string,
    handlePress?: (() => any),
    privilege: string,
    first_name: string,
    last_name: string,
    employer?: string,
    matching_rate?: string | number
    moneyContributed?: any,
    hoursContributed?: any,
    userID?: any,
    orgID?: any,
    kickPress: (() => any),
    acceptPress: (() => any),
    hideButtons: boolean,
}

const PersonItem = ({username, handlePress, privilege, first_name, last_name, employer, matching_rate, moneyContributed, hoursContributed, userID, orgID, kickPress, acceptPress, hideButtons} : PersonItemProps ) => {
  return (
    <TouchableOpacity className='bg-white p-5 rounded-md m-4'>
      <View className='flex flex-row justify-between'>
        <View className='flex-1'>
            <Text className='text-lg font-bold'>{username}</Text>
        </View>
        <Text className={`leading-7`}>{privilege === "board_member" ? "board member" : privilege }</Text>
      </View>
      <View className='h-1 bg-slate-100 my-1 rounded-md'></View>
      <Text className='mt-1'>{first_name} {last_name}</Text>
      <View className='flex flex-row mt-2'>
        <Text className='font-light italic'>{employer}</Text>
        <>
            <Text> • </Text>
            <Text className='font-light italic'>${matching_rate}/hr</Text>
        </>
      </View> 
      <View className='flex-row justify-end'>
        {/* <CustomButton
          title='manage'
          textStyles='px-5 text-slate-600'
          handlePress={() => {}}
          containerStyles='h-5'
        >
        </CustomButton> */}
        {!hideButtons ? 
        privilege ?
        <>
            <CustomButton
                title='kick'
                textStyles='text-rose-700'
                handlePress={kickPress}
                containerStyles='h-5'
            >  
            </CustomButton>
        </>
        : 
        <>
            <CustomButton
                title='accept'
                textStyles='text-cyan-700'
                handlePress={acceptPress}
                containerStyles='h-5'
            >  
            </CustomButton>
        </>
        : <></> }
      </View>
    </TouchableOpacity>
  )
}

export default PersonItem