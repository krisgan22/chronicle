import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '@/appwrite_backend/useAppwrite';
import { joinedOrgs } from '@/appwrite_backend/service'
import { Link, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { Snackbar } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrgItem from '@/components/OrgItem';
import SearchBar from '@/components/SearchBar';

const Orgs = () => {
  
  const { user, setUser, setIsSignedIn} = useAppwriteContext();
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data: organizations, refetch } = useAppwrite(() => joinedOrgs(user["userId"]))
  const [refreshing, setRefreshing] = useState(false)

  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const [snackbarText, setSnackbarText] = useState("")

  const [searchValue, setSearchValue] = useState("")

  const onRefresh = async () => {
    setRefreshing(true);

    // refresh
    await refetch();

    setRefreshing(false);
  }

  useFocusEffect(
    useCallback(() => {
      onRefresh();
      const showLeftMsg = async () => {
        const shouldShowMsg = await AsyncStorage.getItem('leftOrgMsg');
        console.log("orgs.tsx: showLeftMsg(): ", shouldShowMsg);
        if (shouldShowMsg) {
            console.log("orgs.tsx: showLeftMsg(): Displaying left org message")
            await AsyncStorage.removeItem('leftOrgMsg')
            setSnackbarText(`You have left ${shouldShowMsg}`);
            setSnackbarVisible(true);
        }
      }
  
      showLeftMsg();
    }, [])
  );

  useEffect(() => {
    const showLeftMsg = async () => {
      const shouldShowMsg = await AsyncStorage.getItem('leftOrgMsg');
      console.log("orgs.tsx: showLeftMsg(): ", shouldShowMsg);
      if (shouldShowMsg) {
          console.log("orgs.tsx: showLeftMsg(): Displaying left org message")
          await AsyncStorage.removeItem('leftOrgMsg')
          setSnackbarText(`You have left ${shouldShowMsg}`);
          setSnackbarVisible(true);
      }
    }

    showLeftMsg();
  }, [])

  console.log("orgs.tsx: ", organizations);

  return (
    <SafeAreaView className='h-full'>
      <View className="flex my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            <Text className="text-2xl font-bold">
              Your Organizations
            </Text>
          </View>

        </View>
      </View>
      {/* <Text>Create an empty component and put it here if org list is empty.</Text> */}
      {(organizations === undefined) || (organizations["total"] === 0)
      ?
      <>
        <View className='mx-5 mb-5 flex justify-center items-center'>
          <Text className='font-bold text-lg'>No joined organizations.</Text>
          <Link href='/home' className='pt-2 font-medium text-lg'>Click here to find organizations!</Link>
        </View>  
      </>
      :
      <>
        <View className='mx-5 mb-5'>
          <SearchBar
            placeholder='Search for organizations...'
            value={searchValue}
            handleChangeText={(e) => setSearchValue(e)}
            title=''
          />
        </View>
        <FlatList
        // data={[{$id: 1}, {$id: 2}, {$id: 3}]}
        data={!searchValue ? organizations : organizations.filter((item: any) => item.name.toLowerCase().includes(searchValue.toLowerCase()))}
        keyExtractor={(item : any) => item.$id}
        renderItem={({item}) => (
          // <Text className='text-3xl'>{item.$id}</Text>
          // <Link className='text-3xl' href={`joinedOrg/${item.name}?orgDesc=${item.description}&orgID=${item.$id}&orgTasks=${item.tasks}`}>{item.name}</Link>
          <OrgItem
          orgName={item.name}
          handlePress={() => {
            router.push(`joinedOrg/${item.name}?orgDesc=${item.description}&orgID=${item.$id}&orgTasks=${item.tasks}`)
          }}
          desc={item.description}
        >
        </OrgItem>
        )}
        refreshControl={
          <RefreshControl 
          refreshing={false} // I commented this to hide the refreshing animation it did every time we navigated back to this screen
          onRefresh={onRefresh}/>
          }
        >
        </FlatList> 
      </>
      }
      <Snackbar
          visible={snackbarVisible}
          onDismiss={onDismissSnackBar}>
          {snackbarText}
      </Snackbar>
    </SafeAreaView>
  )
}

export default Orgs