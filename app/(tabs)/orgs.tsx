import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '@/appwrite_backend/useAppwrite';
import { joinedOrgs, joinedOrgsAndContributions } from '@/appwrite_backend/service'
import { Link, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { Snackbar } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrgItem from '@/components/OrgItem';
import SearchBar from '@/components/SearchBar';
import CustomButton from '@/components/CustomButton';

type OrgType = {
  $collectionID: string,
  $createdAt: string,
  $databaseId: string,
  $id: string,
  $permissions: string,
  $tenant: string,
  $updatedAt: string,
  TIN: string,
  contact_person_id: string,
  description: string,
  members: string[],
  name: string,
  phone_num: string,
  tasks: string[]
};

type OrgTypeList = OrgType[];

type ContributionType = {
  hours: string,
  money: number,
}

type ContributionContainer = {
  [key: string]: ContributionType
}

const Orgs = () => {
  
  const { user, userDetails, setUser, setIsSignedIn} = useAppwriteContext();
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [organizations, setOrganizations] = useState<OrgTypeList>([])
  const [contributions, setContributions] = useState<ContributionContainer>({});

  const { data: result, refetch } = useAppwrite(() => joinedOrgsAndContributions(user["userId"], userDetails.matching_rate))
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (result) {
      console.log("orgs.tsx: useEffect(): result: ", result)
      setOrganizations(result.orgs);
      setContributions(result.contributions);
    }
  }, [result])
  

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

  console.log("orgs.tsx: organizations: ", organizations);
  console.log("orgs.tsx: contributions: ", contributions);

  return (
    <SafeAreaView className='h-full'>
      <View className="flex my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            <Text className="text-2xl font-bold">
              Your Volunteer Organizations
            </Text>
          </View>

        </View>
      </View>
      {(organizations === undefined) || organizations === null || Object.keys(organizations).length === 0
      ?
      <>
        <View className='mx-5 mb-5 flex justify-center items-center'>
          <Text className='font-bold text-lg'>No joined organizations.</Text>
          <CustomButton
              title='Find Organizations'
              handlePress={() => {
                router.replace("/home")
              }}
              containerStyles='px-5 mt-7 bg-black'
              isLoading={isSubmitting}
              textStyles='text-base font-medium text-white'
            />
          <CustomButton
              title='Refresh'
              handlePress={onRefresh}
              containerStyles='px-5 mt-7 bg-black'
              isLoading={isSubmitting}
              textStyles='text-base font-medium text-white'
          />
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
        data={!searchValue ? organizations : organizations.filter((item: any) => item.name.toLowerCase().includes(searchValue.toLowerCase()))}
        keyExtractor={(item : any) => item.$id}
        renderItem={({item}) => (
          <OrgItem
          orgName={item.name}
          handlePress={() => {
            router.push(`joinedOrg/${item.name}?orgDesc=${item.description}&orgID=${item.$id}&orgTasks=${item.tasks}`)
          }}
          desc={item.description}
          hoursContributed={contributions[item.$id].hours}
          moneyContributed={contributions[item.$id].money}
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