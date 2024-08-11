import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { decideTimesheet, deleteActivity, getAllSubmittedActivities, getSubmittedActivities } from '@/appwrite_backend/service'
import useAppwrite from '@/appwrite_backend/useAppwrite';
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskItem from '@/components/TaskItem';
import Loading from '@/components/Loading';
import SwitchSelector from "react-native-switch-selector";
import BackButton from '@/components/BackButton';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '@/components/CustomButton';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Papa from 'papaparse';
import FormFieldTextArea from '@/components/FormFieldTextArea';
import BottomSheet, { BottomSheetModal, useBottomSheet, useBottomSheetModal } from '@gorhom/bottom-sheet';
import DecisionBottomSheetModal from '@/components/DecisionBottomSheetModal';
import FilterBottomSheetModal from '@/components/FilterBottomSheetModal';

const SubmittedActivities = () => {
    const { user, userDetails } = useAppwriteContext();
    const { orgName, orgID } = useLocalSearchParams();
    const { data: activities, isLoading, refetch } = useAppwrite(() => getAllSubmittedActivities(orgID))
    const [selectedStatus, setSelectedStatus] = useState<string>("pending")

    // console.log("SubmittedActivities ([orgName].tsx): ", activities);
    
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const onDismissSnackBar = () => setSnackbarVisible(false);
    const [snackbarText, setSnackbarText] = useState("")

    const onRefresh = async () => {
        // refresh
        await refetch();
    }

    useFocusEffect(
        useCallback(() => {
            const showEditMsg = async () => {
                const shouldEditMsg = await AsyncStorage.getItem('timesheetEdited');
                console.log("GET ITEM IN useFocusEffect: ", shouldEditMsg);
                if (shouldEditMsg) {
                    await AsyncStorage.removeItem('timesheetEdited')
                    setSnackbarText(shouldEditMsg);
                    setSnackbarVisible(true);
                }
              }
          
              showEditMsg();
            onRefresh();
        }, [])
      );

    // Options for formatting
    const TimeOption: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    const noTimeOption: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const dateReadable = (date: string, options: Intl.DateTimeFormatOptions) => {
        const dateObject = new Date(date);
        return dateObject.toLocaleDateString('en-US', options);
    }

    const taskStatusOptions = [
        { label: "Pending", value: "pending",},
        { label: "Approved", value: "approved"},
        { label: "Rejected", value: "rejected"}
      ];

    const updateTimesheetDecision = async (timesheetID: any, decision: string, reason: string = "") => {
        if (decision === "approved")
        {
            setSnackbarText("Successfully approved timesheet");
            await decideTimesheet(timesheetID, user.userId, userDetails.first_name, userDetails.last_name, reason, decision);
        }
        else if (decision === "rejected")
        {
            setSnackbarText("Successfully rejected timesheet");
            await decideTimesheet(timesheetID, user.userId, userDetails.first_name, userDetails.last_name, reason, decision);
        }
        else {
            setSnackbarText("There was an error, try again");  
        }
        await refetch();
        setSnackbarVisible(true);
    }

    const handleExportCsv = async () => {
        try {

        // Type for timesheet data 
        type DataItem = {
            desc:any,
            userID:any,
            orgID:any,
            taskName:any,
            start_date:any,
            end_date: any,
            taskStatus: any,
            submittedDate: any,
            $updatedAt: any,
        }

        // Fields and their mappings to include in the CSV
        const fieldNames: { [key in keyof DataItem]?: string } = {
            desc:'Description', 
            userID:'User ID',
            orgID:'Organization ID',
            taskName:'Task',
            start_date:'Start Date',
            end_date: 'End Date',
            taskStatus: 'Task Status',
            submittedDate: 'Submitted Date',
            $updatedAt: 'Updated Date'
        };

        // New list of objects with renamed keys
        const mappedData = activities.map((item : any) => {
            const mappedItem: { [key: string]: any } = {};
            for (const key in item) {
              if (fieldNames[key as keyof DataItem]) {
                mappedItem[fieldNames[key as keyof DataItem]!] = item[key as keyof DataItem];
              }
            }
            return mappedItem;
          });

        // Convert JSON to CSV
        const csv = Papa.unparse(mappedData);

        // Define file path
        const fileUri = FileSystem.documentDirectory + 'timesheets.csv';

        // Write CSV file to file system
        await FileSystem.writeAsStringAsync(fileUri, csv);

        // Open share menu
        await Sharing.shareAsync(fileUri);
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    };
    
    const [modalTaskID, setModalTaskID] = useState("");
    const [decisionReason, setDecisionReason] = useState("")
    
    const decisionModalRef = useRef<BottomSheetModal>(null);
    const { dismiss:decisionModalDismiss } = useBottomSheetModal();
    const handlePresentModalPress = (taskID: string) => {
        setModalTaskID(taskID);
        decisionModalRef.current?.present();
    }

    const filterModalRef = useRef<BottomSheetModal>(null);
    const { dismiss:dismissFilterModal } = useBottomSheetModal();
    const handlePresentFilterModalPress = () => {
        filterModalRef.current?.present();
    }
    
    // const [userSet, setUserSet] = useState<Set<string>>(new Set())
    // const [startDateSet, setStartDateSet] = useState<Set<Date>>(new Set())
    // const [endDateSet, setEndDateSet] = useState<Set<Date>>(new Set())
    // const [userSelections, ]

    // const addToSet = (item: any, func: (e: any) => void) => {
    //     func((prevSet:any) => new Set(prevSet).add(item));
    // };
    // const removeFromSet = (item: any) => {
    //     setUserSet(prevSet => {
    //       const newSet = new Set(prevSet);
    //       newSet.delete(item);
    //       return newSet;
    //     });
    // };
    // const hasItem = (item: any) => {
    //     return userSet.has(item);
    // };
    //   const clearSet = () => {
    //     setUserSet(new Set());
    // };

    type FilterTypes = 'userIDs' | 'tasks';

    const [earliestDate, setEarliestDate] = useState("");
    const [latestDate, setLatestDate] = useState("");
    
    const [earliestDateFilter, setEarliestDateFilter] = useState("");
    const [latestDateFilter, setLatestDateFilter] = useState("");

    const [uniqueItems, setUniqueItems] = useState({
        userIDs: new Set<string>(),
        tasks: new Set<string>(),
    });

    const [filters, setFilters] = useState({
        userIDs: [] as string[],
        tasks: [] as string[],
    });

    const overwriteFilterList = (items: string[], type: FilterTypes) => {
        setFilters(prevFilters => ({
          ...prevFilters,
          [type]: items,
        }));
    };

    // const [filters, setFilters] = useState({
    //     userIDs: new Set<string>(),
    //     startDates: new Set<string>(),
    //     endDates: new Set<string>(),
    // });

    // const addItemToFilter = (item: string, type: FilterTypes) => {
    //   setFilters(prevFilters => {
    //     const updatedSet = new Set(
    //       prevFilters[type] as Set<string> 
    //     );
    
    //     updatedSet.add(item);
    
    //     return {
    //       ...prevFilters,
    //       [type]: updatedSet,
    //     };
    //   });
    // };

    // const removeItemFromFilter = (item: string, type: FilterTypes) => {
    //     setFilters(prevFilters => {
    //       const updatedSet = new Set(
    //         prevFilters[type] as Set<string> 
    //       );
      
    //       updatedSet.delete(item); // Remove the item from the Set
      
    //       return {
    //         ...prevFilters,
    //         [type]: updatedSet,
    //       };
    //     });
    // };

    const addItemToUniques = (item: string, type: FilterTypes) => {
        setUniqueItems(prevUniques => {
          const updatedSet = new Set(
            prevUniques[type] as Set<string> 
          );
      
          updatedSet.add(item);
      
          return {
            ...prevUniques,
            [type]: updatedSet,
          };
        });
      };
  
    //   const removeItemFromUniques = (item: string, type: FilterTypes) => {
    //     setUniqueItems(prevUniques => {
    //         const updatedSet = new Set(
    //             prevUniques[type] as Set<string> 
    //         );
        
    //         updatedSet.delete(item); // Remove the item from the Set
        
    //         return {
    //           ...prevUniques,
    //           [type]: updatedSet,
    //         };
    //       });
    // };

    // const overwriteFilter = (items: string[], type: FilterTypes) => {
    //     setFilters(prevFilters => {
    //       const newSet = new Set(items);
      
    //       return {
    //         ...prevFilters,
    //         [type]: newSet,
    //       };
    //     });
    //   };

    const [filterUserData, setFilterUserData] = useState<{ label: string; value: string }[]>([]);
    const [filterTaskData, setFilterTaskData] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        if (activities)
        {
            activities.forEach((item : any) => {
                console.log(item.userID + ":" + item.user_first_name + " " + item.user_last_name)
                addItemToUniques(item.userID + ":" + item.user_first_name + " " + item.user_last_name, "userIDs")
                addItemToUniques(item.taskName, "tasks");
            });

            const { earliestDate, latestDate } = activities.reduce((acc: any, item:any) => {
                const itemStartDate = new Date(item.start_date);
                const itemEndDate = new Date(item.end_date);
              
                if (!acc.earliestDate || itemStartDate < new Date(acc.earliestDate)) {
                  acc.earliestDate = item.start_date;
                }
              
                if (!acc.latestDate || itemEndDate > new Date(acc.latestDate)) {
                  acc.latestDate = item.end_date;
                }
              
                return acc;
            }, { earliestDate: null as string | null, latestDate: null as string | null });
            
            setEarliestDate(earliestDate);
            setLatestDate(latestDate);

            const mappedUserData = Array.from(uniqueItems.userIDs).map(user => {
                const [userID, username] = user.split(':');
                return {
                  label: username,
                  value: user
                };
            });
          
            setFilterUserData(mappedUserData);

            const mappedTaskData = Array.from(uniqueItems.tasks).map(task => {
                return {
                    label: task,
                    value: task,
                }
            })

            setFilterTaskData(mappedTaskData);
        }
        // console.log("FILTERS: ", filters);
        // console.log("UNIQUES: ", uniqueItems);
        // console.log("FLATLIST DATA: ", flatListData);
    }, [activities])

    const filteredActivities = useMemo(() => {
        return activities.filter((item : any) => {
          let matches = true;

          const itemStartDate = new Date(item.start_date);
        //   const itemEndDate = new Date(item.endDate);

        console.log("EARLIEST DATE FILTER: ", earliestDateFilter);
        // console.log("LATEST DATE FILTER: ", latestDateFilter);

          if (item.taskStatus !== selectedStatus) {
            matches = false
          }
      
          if (filters.userIDs.length > 0 && !filters.userIDs.includes(item.userID + ":" + item.user_first_name + " " + item.user_last_name)) {
            matches = false;
          }

          if (filters.tasks.length > 0 && !filters.tasks.includes(item.taskName)) {
            matches = false;
          }

          if (earliestDateFilter && itemStartDate < new Date(earliestDateFilter)) {
            matches = false
          }

          if (latestDateFilter && itemStartDate > new Date(latestDateFilter))
          {
            matches = false
          }
      
      
        //   if (filters.startDates.size > 0 && !Array.from(filters.startDates).some(date => new Date(date) <= itemStartDate)) {
        //     matches = false;
        //   }
      
        //   if (filters.endDates.size > 0 && !Array.from(filters.endDates).some(date => new Date(date) >= itemEndDate)) {
        //     matches = false;
        //   }
      
          return matches;
        });
    }, [activities, filters, selectedStatus]);

    // const filteredActivitiesNoMemo = activities.filter((item: any) => {
    //     let matches = true;
      
    //     if (filters.userIDs.size > 0 && filters.userIDs.has(item.username)) {
    //       matches = false;
    //     }
      
    //     if (filters.startDates.size > 0 && Array.from(filters.startDates).some(date => new Date(date) <= item.startDate)) {
    //       matches = false;
    //     }
      
    //     if (filters.endDates.size > 0 && Array.from(filters.endDates).some(date => new Date(date) >= item.endDate)) {
    //       matches = false;
    //     }
      
    //     return matches;
    // });

    const addFilterTest = () => {
        overwriteFilterList(["66a6ce230022578fb676:New Signup"], "userIDs");
    }

    const delFilterTest = () => {
        overwriteFilterList([], "userIDs");
    }

    return (
        <SafeAreaView className='h-full'>
            <View className='flex flex-row justify-between mx-5'>
                <BackButton></BackButton>
                <View className='flex flex-row'>
                    <CustomButton
                        handlePress={handlePresentFilterModalPress}
                        title='Filter'
                        containerStyles='my-5 px-5 bg-gray-500 rounded-full h-8 justify-center items-center mr-5'
                        textStyles='text-white'
                    />
                    {/* <CustomButton
                        handlePress={addFilterTest}
                        title='add'
                        containerStyles='my-5 px-5 bg-green-500 rounded-full h-8 justify-center items-center'
                        textStyles='text-white'
                    >
                    </CustomButton>
                    <CustomButton
                        handlePress={delFilterTest}
                        title='del'
                        containerStyles='my-5 px-5 bg-rose-500 rounded-full h-8 justify-center items-center'
                        textStyles='text-white'
                    >
                    </CustomButton> */}
                    <CustomButton
                        title='Export Data'
                        handlePress={handleExportCsv}
                        containerStyles='my-5 px-5 bg-cyan-500 rounded-full h-8 justify-center items-center'
                        textStyles='text-white'
                    >
                    </CustomButton>
                </View>
            </View>
            {/* {isLoading === true ? <Loading></Loading> : <></>} */}
            <View className='flex items-left mt-1 mb-6 ml-5'>
                <Text className='text-3xl font-bold text-black'>Manage Timesheets</Text>
            </View>
            <View className='mx-10 pb-5'>
                <SwitchSelector
                    options={taskStatusOptions}
                    initial={0}
                    onPress={(value: any) => setSelectedStatus(value)}
                    buttonColor={'#000000'}
                
                />
            </View>
            <FlatList
                // data={activities.filter((item: any) => item.taskStatus === selectedStatus)}
                data={filteredActivities}
                keyExtractor={(item : any) => item.$id}
                renderItem={({item}) => (
                    <TaskItem
                        taskID={item.$id}
                        taskName={item.taskName}
                        handlePress={() => {
                            // console.log(item);
                            // router.push(`joinedOrg/submitted/view/${item.$id}`)
                        }}
                        deletePress={() => {
                            deleteActivity(item.$id)
                            onRefresh();
                            setSnackbarText("Successfully deleted timesheet");
                            setSnackbarVisible(true);
                        }}
                        editPress={() => {
                            router.push(`joinedOrg/submitted/edit/${item.$id}?taskName=${item.taskName}&taskDesc=${item.desc}&startDate=${item.start_date}&endDate=${item.end_date}&orgID=${orgID}`)
                        }}
                        taskStatus={item.taskStatus}
                        subDate={dateReadable(item.submittedDate, TimeOption)}
                        startDate={item.start_date}
                        endDate={item.end_date}
                        desc={item.desc}
                        username={item.user_first_name + " " + item.user_last_name}
                        approvePress={() => updateTimesheetDecision(item.$id, "approved")}
                        // rejectPress={() => updateTimesheetDecision(item.$id, "rejected")}
                        rejectPress={() => handlePresentModalPress(item.$id)}
                        approver_first_name={item.approver_first_name}
                        approver_last_name={item.approver_last_name}
                        approver_update_date={item.approver_update_date ? dateReadable(item.approver_update_date, noTimeOption) : item.approver_update_date}
                        text_response={item.text_response}
                    >
                    </TaskItem>
                )}
                ListEmptyComponent={
                    <View className='flex justify-center items-center mt-6'>
                        <Text className='text-lg text-black'>There are no {selectedStatus} items.</Text>
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
                // action={{
                //     label: 'Refresh',
                //     onPress: () => {
                //         onRefresh();
                //     },
                //     labelStyle: {color: 'white', fontWeight: 'bold'}
                //     }}
                >
                {snackbarText}
            </Snackbar>
            <DecisionBottomSheetModal 
                ref={decisionModalRef}
                taskID={modalTaskID}
                decisionPress={() => {
                    updateTimesheetDecision(modalTaskID, "rejected", decisionReason)
                    setDecisionReason("");
                    decisionModalDismiss();
                }}
                textInput={decisionReason}
                handleTextInput={setDecisionReason}
            />
            <FilterBottomSheetModal
                ref={filterModalRef}
                userData={filterUserData}
                confirmedUserDataList={filters.userIDs}

                taskData={filterTaskData}
                confirmedTaskDataList={filters.tasks}

                setConfirmedLists={overwriteFilterList}
                dismiss={dismissFilterModal}

                earliestDate={earliestDate}
                latestDate={latestDate}

                setEarliestDateFilter = {setEarliestDateFilter}
                setLatestDateFilter = {setLatestDateFilter}
            />
        </SafeAreaView>
    )
}

const containerStyle = {
    backgroundColor: 'white', 
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
    height: 200,
};

export default SubmittedActivities