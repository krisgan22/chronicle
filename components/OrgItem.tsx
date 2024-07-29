import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Task } from 'react-native';

type OrgItemProps = {
    orgName: string,
    handlePress: (() => any),
    desc: string,
    moneyContributed?: any,
    hoursContributed?: any,
}

const OrgItem = ({orgName, handlePress, desc, moneyContributed, hoursContributed} : OrgItemProps) => {
    const maxTaskLength = 25;
    console.log("MONEY: ", moneyContributed);
    console.log("HOURS: ", hoursContributed);
    return (
    <TouchableOpacity className='bg-white p-5 rounded-md m-4' onPress={handlePress}>
      <View className='flex flex-row justify-between'>
        <View className='flex-1'>
            <Text className='text-xl font-bold'>{orgName.length > maxTaskLength ? orgName.substring(0, maxTaskLength) + '...' : orgName}</Text>
        </View>
      </View>
      <View className='h-1 bg-slate-100 my-1 rounded-md'></View>
      <Text className='mt-1' numberOfLines={4}>{desc}</Text>
      {hoursContributed ? (<>
              <View className='flex flex-row mt-2'>
              <Text className='font-light italic'>You Contributed: {hoursContributed}</Text>
              { moneyContributed ? (
              <>
                <Text> • </Text>
                <Text className='font-light italic'>${moneyContributed.toFixed(2)}</Text>
              </>) : <></>}
            </View>
            </>) : <></>
      }
    </TouchableOpacity>
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

export default OrgItem;