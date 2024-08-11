import { View, Text, StyleSheet } from 'react-native'
import React, { forwardRef, useMemo, useState } from 'react'
import { BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import CustomButton from './CustomButton'
import { MultiSelect } from 'react-native-element-dropdown';

type Props = {
    userData: { label: string; value: string }[],
    confirmedUserDataList: string[],
    setConfirmedUserDataList: (item: string[], type: any) => void,
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
    const snapPoints = useMemo(() => [ "80%"] , []);
    const [selected, setSelected] = useState([]);
    return (
    <BottomSheetModal 
        ref={ref}
        snapPoints={snapPoints}
        keyboardBehavior='interactive'
        keyboardBlurBehavior='restore'
        >
        <BottomSheetView className='h-full mx-5'>
            <MultiSelect
                search
                data={props.userData}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={selected}
                onChange={(item: any) => {
                    setSelected(item);
                    console.log(item);
                }}
                maxSelect={5}
            />
            <CustomButton
                title='Confirm'
                handlePress={() => {
                    props.setConfirmedUserDataList(selected, "userIDs")
                    console.log("CONFIRMED LIST: ", props.confirmedUserDataList);
                    props.dismiss();
                }}
                containerStyles='mt-5 bg-sky-600'
                textStyles='text-base font-medium text-white'
            />
        </BottomSheetView>
    </BottomSheetModal>
    )
});

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: "grey",
    },
    textInput: {
      alignSelf: "stretch",
      padding: 12,
      borderRadius: 12,
      backgroundColor: "#d9d9d9"
    },
    contentContainer: {
      flex: 1,
      alignItems: "center",
    },
  });
  

export default FilterBottomSheetModal