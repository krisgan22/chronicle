import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppwrite from '@/appwrite_backend/useAppwrite'
import { acceptUserOrgJoinRequest, getCurrentUser, getCurrentUserOrgPrivilege, getOrgMembers, leaveOrg } from '@/appwrite_backend/service'
import { useLocalSearchParams } from 'expo-router'
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext'
import SwitchSelector from "react-native-switch-selector";
import PersonItem from '@/components/PersonItem'
import { Snackbar } from 'react-native-paper';

const manageMembers = () => {
  const { user, userDetails } = useAppwriteContext();
  const { orgID, orgName } = useLocalSearchParams();
  const { data: privilege } = useAppwrite(() => getCurrentUserOrgPrivilege(user["userId"], orgID))
  const { data: members, refetch } = useAppwrite(() => getOrgMembers(orgID))
  console.log("manageMembers.tsx: privilege: ", privilege);
  console.log("manageMembers.tsx: members: ", members);

  const [selectedUserStatus, setSelectedUserStatus] = useState("accepted")

  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const [snackbarText, setSnackbarText] = useState("")

  const memberStatusOptions = [
    { label: "Joined", value: "accepted",},
    { label: "Requested", value: "pending"},
  ];

  const acceptUser = async (userID: any, orgID: any, username: any, privilege: any) => {
    await acceptUserOrgJoinRequest(userID, orgID, privilege)
    await refetch();
    setSnackbarText(`Successfully accepted ${username}`);
    setSnackbarVisible(true);
  }

  const kickUser = async (userID: any, orgID: any, username: any) => {
    await leaveOrg(userID, orgID)
    await refetch();
    setSnackbarText(`Successfully kicked ${username}`);
    setSnackbarVisible(true);
  }

  const onRefresh = async () => {
    // refresh
    await refetch();
  }

  // const filteredData = members[0].documents.filter((item: any) => members[1][item.userID]["status"] === selectedUserStatus);

  return (
    <SafeAreaView className='h-full'>
      <View className='flex items-left mt-5 mb-6 ml-5'>
        <Text className='text-3xl font-bold text-black'>Members of {orgName}</Text>
      </View>
      {privilege !== null && privilege !== undefined && (privilege === "board_member" || privilege === "mentor") ?
        <>
          <View className='mx-10'>
            <SwitchSelector
                options={memberStatusOptions}
                initial={0}
                onPress={(value: any) => setSelectedUserStatus(value)}
                buttonColor={'#000000'}
            
            />
          </View>
        </>
        :
        <></>
      }
      <FlatList
        data={members[0] ? members[0].documents.filter((item: any) => members[1][item.userID]["status"] === selectedUserStatus) : []}
        keyExtractor={(item : any) => item.$id}
        renderItem={({item}) => (
            <PersonItem
              username={item.username}
              privilege={members[1][item.userID]["privilege"]}
              first_name={item.first_name}
              last_name={item.last_name}
              employer={item.employer}
              matching_rate={item.matching_rate}
              userID={item.userID}
              orgID={orgID}
              kickPress={() => {
                kickUser(item.userID, orgID, item.username);
              }}
              acceptPress={() => {
                acceptUser(item.userID, orgID, item.username, "volunteer")
              }}
              hideButtons={user.userId === item.userID}
            >
            </PersonItem>
        )}
        ListEmptyComponent={
          <View className='flex justify-center items-center mt-6'>
              <Text className='text-lg text-black'>No such user found.</Text>
          </View>}
        refreshControl={
          <RefreshControl 
          refreshing={false} // I commented this to hide the refreshing animation it did every time we navigated back to this screen
          onRefresh={onRefresh}/>
          }
      >
      </FlatList>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        >
        {snackbarText}
      </Snackbar>
    </SafeAreaView>
  )
}

export default manageMembers


// [{"documents": [[Object]], "total": 1}, 
// {"66a707ab00198fafa3c5": {"$collectionId": "6691815800103a613c30", "$createdAt": "2024-08-02T19:15:33.085+00:00", "$databaseId": "667f794f8e378826d55c", "$id": "66ad3054001d7fef173c", "$permissions": [Array], "$tenant": "156441", "$updatedAt": "2024-08-02T20:28:58.137+00:00", "date_created": "2024-08-02T19:15:32.470+00:00", "date_updated": "2024-08-02T19:15:32.470+00:00", "orgID": "668ddff40021ef440232", "orgName": "VEDA", "privilege": "board_member", "status": "accepted", "userID": "66a707ab00198fafa3c5", "username": "testk"}
// }]