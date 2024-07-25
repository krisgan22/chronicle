import { View, Text, Alert, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { signOutAccountDeleteSession, getOrganizations, getOrgTasks } from '@/appwrite_backend/service';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Link, router } from 'expo-router'
import Loading from '@/components/Loading';
import useAppwrite from '@/appwrite_backend/useAppwrite';

import { Snackbar } from 'react-native-paper'
import TaskItem from '@/components/TaskItem';
import { ScrollView } from 'react-native-gesture-handler';
import OrgItem from '@/components/OrgItem';
import SearchBar from '@/components/SearchBar';

type ItemType = 
{
  id : number
}

export default function Home() {
  const { user, setUser, setIsSignedIn} = useAppwriteContext();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const onDismissSnackBar = () => setSnackbarVisible(false);

  const { data: organizations, refetch  } = useAppwrite(getOrganizations);

  const [refreshing, setRefreshing] = useState(false);

  const [searchValue, setSearchValue] = useState("")
 
  useEffect(() => {
    const showWelcomeMsg = async () => {
      const shownMsg = await AsyncStorage.getItem('welcomeMsg');
      if (!shownMsg) {
          console.log("home.tsx: showWelcomeMsg(): Displaying welcome message")
          await AsyncStorage.setItem('welcomeMsg', "1");
          setSnackbarVisible(true);
      }
    }

    showWelcomeMsg();
  }, [])
  

  const onRefresh = async () => {
    setRefreshing(true);

    // refresh
    await refetch();

    setRefreshing(false);
  }

  console.log("home.ts: ", organizations);

  const submit = async () => {
    try {
      setIsSubmitting(true);
      await signOutAccountDeleteSession();
      
      // Remove from Async Storage
      await AsyncStorage.removeItem('user');
      console.log("Async Storage remove user");

      // Update global appwrite context
      setUser(null);
      setIsSignedIn(false);

      router.replace('/sign-in');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
    console.log("user: ", user);
  }

  return (
    <SafeAreaView className='h-full'>
      <View className="flex my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            <Text className="text-2xl font-bold">
              Find Organizations
            </Text>
          </View>
        </View>

      </View>
      <View className='mx-5 mb-5'>
        <SearchBar
          placeholder='Search for organizations...'
          value={searchValue}
          handleChangeText={(e) => setSearchValue(e)}
          title=''
        />
      </View>
      {/* <Text className="text-3xl">Welcome {user && user.providerUid ? user.providerUid : ''}</Text> */}
      <FlatList
        // data={[{id: 1}, {id: 2}, {id: 3}]}
        data={!searchValue ? organizations : organizations.filter((item: any) => item.name.toLowerCase().includes(searchValue.toLowerCase()))}
        keyExtractor={(item : any) => item.$id}
        renderItem={({item}) => (
          // <Link className='text-3xl' href={`viewOrg/${item.name}?orgDesc=${item.description}&orgID=${item.$id}`}>{item.name}</Link>
          <OrgItem
            orgName={item.name}
            handlePress={() => {
              router.push(`viewOrg/${item.name}?orgDesc=${item.description}&orgID=${item.$id}`)
            }}
            desc={item.description}
          >
          </OrgItem>
        )}
        refreshControl={<RefreshControl 
          refreshing={refreshing}
          onRefresh={onRefresh}/>}>
      </FlatList>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}>
        Welcome to Chronicle!
      </Snackbar>
      {/* <CustomButton
          title='Log Out'
          handlePress={submit}
          containerStyles='mt-7 bg-red-200'
          isLoading={isSubmitting}
        /> */}
      {isSubmitting == true ? <Loading></Loading> : null}
    </SafeAreaView>
  );
}