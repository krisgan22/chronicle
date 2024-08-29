import { View, Text, StyleSheet, Platform, Alert, TouchableOpacity, ScrollView } from 'react-native'
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import CustomButton from './CustomButton'
import { MultiSelect } from 'react-native-element-dropdown';
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';

type FilterTypes = 'userIDs' | 'tasks';

type Props = {
    userData: { label: string; value: string }[],
    confirmedUserDataList: string[],

    taskData: { label: string; value: string }[],
    confirmedTaskDataList: string[],

    setConfirmedLists: (item: string[], type: FilterTypes) => void,

    earliestDate: string,
    latestDate: string,

    setEarliestDateFilter: (e: string) => void,
    setLatestDateFilter: (e: string) => void,

    dismiss: () => boolean,
}

type Ref = BottomSheetModal

const data = new Set ([
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
    { label: 'Item 9', value: '9' },
  ]);

const FilterBottomSheetModal = forwardRef<Ref, Props>((props, ref) => {
    const renderBackdrop = useCallback(
      (props : any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          enableTouchThrough={false}
        />
      ),
      []
    );

    const snapPoints = useMemo(() => ["80%"] , []);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);

    // console.log("EARLIEST: ", props.earliestDate)
    // console.log("LATEST: ", props.latestDate)

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [startD, setStartD] = useState<Date>(new Date());
    const [endD, setEndD] = useState<Date>(new Date());

    useEffect(() => {
      console.log("FILTER BOTTOM SHEET USE EFFECT")
      if (props.earliestDate)
      {
        setStartD(new Date(props.earliestDate));
      }
      if (props.latestDate)
      {
        setEndD(new Date(props.latestDate));
      }
    }, [props.earliestDate, props.latestDate])
    

    const setStartDate = (event: DateTimePickerEvent, date?: Date | undefined) => {
      setShowDatePicker(false);
      const {
        type,
        nativeEvent: {timestamp, utcOffset},
      } = event;
      console.log("START DATE: ", date);
      if (date)
        {
          date.setHours(0, 0, 0, 0);
          setEndD(date);
        }
    };

    const setEndDate = (event: DateTimePickerEvent, date?: Date | undefined) => {
      setShowDatePicker(false);
      const {
        type,
        nativeEvent: {timestamp, utcOffset},
      } = event;
      console.log("END DATE: ", date);
      if (date)
      {
        date.setHours(23, 59, 59, 999);
        setEndD(date);
      }
    };

        // Options for formatting
      const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };

    const dateReadable = (date: string) => {
      const dateObject = new Date(date);
      return dateObject.toLocaleDateString('en-US', dateOptions);
    }

    const onChange = (event: DateTimePickerEvent, selectedDate: any, fn: (...any: any[]) => any, setEndOfDay: boolean) => {
      const currentDate = selectedDate || startD;
      setShowDatePicker(Platform.OS === 'ios');

      if (setEndOfDay)
      {
        currentDate.setHours(23, 59, 59, 999);
      }
      else
      {
        currentDate.setHours(0, 0, 0, 0);
      }
      fn(currentDate);
    };

    const showDatepicker = (mode: any, fn: (...any: any[]) => any, value: Date, setEndOfDay: boolean) => {
      if (Platform.OS === 'android') {
        DateTimePickerAndroid.open({
          value: value,
          onChange: (event, selectedDate) => onChange(event, selectedDate, fn, setEndOfDay),
          mode: mode,
          is24Hour: false,
        });
      } else {
          setShowDatePicker(true);
      }
    };

    const renderItem = (item: any) => {
      return (
        <View style={styles.item}>
          <Text style={styles.selectedTextStyle}>{item.label}</Text>
        </View>
      );
    };

    return (
    <BottomSheetModal 
        ref={ref}
        snapPoints={snapPoints}
        keyboardBehavior='interactive'
        keyboardBlurBehavior='restore'
        backdropComponent={renderBackdrop}
        >
        <BottomSheetScrollView
          style={styles.bottomSheetScrollView}>
            <Text className='text-lg font-semibold'>Select User(s)</Text>
            <MultiSelect
                search
                data={props.userData}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={selectedUsers}
                onChange={(item: any) => {
                  setSelectedUsers(item);
                    console.log(item);
                }}
                maxSelect={5}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => (
                  <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                    <View style={styles.selectedStyle}>
                      <Text style={styles.textSelectedStyle}>{item.label}</Text>
                      <AntDesign color="black" name="delete" size={17} />
                    </View>
                  </TouchableOpacity>
                )}
            />
            <Text className='mt-5 text-lg font-semibold'>Select Task(s)</Text>
            <MultiSelect
                search
                data={props.taskData}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={selectedTasks}
                onChange={(item: any) => {
                  setSelectedTasks(item);
                    console.log(item);
                }}
                maxSelect={5}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => (
                  <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                    <View style={styles.selectedStyle}>
                      <Text style={styles.textSelectedStyle}>{item.label}</Text>
                      <AntDesign color="black" name="delete" size={17} />
                    </View>
                  </TouchableOpacity>
                )}
            />

            {/* iOS and Android Date Picker Code */}
            {/* iOS Specific: */}
            {Platform.OS === 'ios' && (<View className='mt-5'>
                    <View className='items-start'>
                        <Text className="text-base font-medium">Start Date</Text>
                        <RNDateTimePicker
                            value={startD}
                            mode='date'
                            onChange={setStartDate}
                            themeVariant="light"
                        ></RNDateTimePicker>
                    </View>                   
                    <View className='mt-5 items-start'>
                        <Text className="text-base font-medium">End Date</Text>
                        <RNDateTimePicker
                            value={endD}
                            mode='date'
                            onChange={setEndDate}
                            themeVariant="light"
                        ></RNDateTimePicker>
                    </View>            
                </View>)}

                {/* Android Specific: */}
                {Platform.OS === 'android' && (<View className='mt-5'>
                    <View className=''>
                        <Text className='text-base font-medium mb-1'>Start Date</Text>
                        <CustomButton
                            title={dateReadable(startD.toISOString())}
                            handlePress={() => {
                                showDatepicker('date', setStartD, startD, false)
                            }}
                            containerStyles='border border-black'
                        ></CustomButton>
                    </View>

                    <View className=''>
                        <Text className='text-base font-medium mb-1 mt-4'>End Date</Text>
                        <CustomButton
                            title={dateReadable(endD.toISOString())}
                            handlePress={() => {
                                setShowDatePicker(!showDatePicker)
                                showDatepicker('date', setEndD, endD, true)
                              }}
                            containerStyles='border border-black'
                        ></CustomButton>
                    </View>
                </View>)}

            {/* */}
            
            <View className='mt-10 flex-1 justify-end p-4'>
                <CustomButton
                    title='Clear Filters'
                    handlePress={() => {
                      setSelectedTasks([]);
                      setSelectedUsers([]);
                      setStartD(new Date(props.earliestDate))
                      setEndD(new Date(props.latestDate))
                    }}
                    containerStyles='mb-5 bg-rose-600 -mx-4'
                    textStyles='text-base font-medium text-white'
                />
                <CustomButton
                    title='Confirm'
                    handlePress={() => {
                        if (new Date(startD) >= new Date(endD)) {
                            Alert.alert("Incorrect Dates", "The start date must be before the end date");
                        }
                        else
                        {
                          console.log("START D: ", startD)
                          props.setConfirmedLists(selectedUsers, "userIDs");
                          props.setConfirmedLists(selectedTasks, "tasks");
                          props.setEarliestDateFilter(startD.toISOString());
                          props.setLatestDateFilter(endD.toISOString());
                          // console.log("CONFIRMED LIST: ", props.confirmedUserDataList);
                          props.dismiss();
                        }
                    }}
                    containerStyles='bg-green-600 -mx-4'
                    textStyles='text-base font-medium text-white'
                />
            </View>
        </BottomSheetScrollView >
    </BottomSheetModal>
    )
});

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
  bottomSheetScrollView: {
    height: '100%',
    marginHorizontal: 20,
  },
});
  

export default FilterBottomSheetModal