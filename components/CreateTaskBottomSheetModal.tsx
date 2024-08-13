import { View, Text, StyleSheet } from 'react-native'
import React, { forwardRef, useCallback, useMemo } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import CustomButton from './CustomButton'

type Props = {
    textInput: string,
    handleTextInput:  ((e : any) => any),
    decisionPress: (() => any),
    isSubmitting?: boolean,
}

type Ref = BottomSheetModal

const CreateTaskBottomSheetModal = forwardRef<Ref, Props>((props, ref) => {

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

  const snapPoints = useMemo(() => ["30%"], []);
  return (
    <BottomSheetModal 
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        >
        <View className='mx-5'>
            <Text className='my-2 font-medium'>Task Name</Text>
            <BottomSheetTextInput 
                placeholder='Why did you choose this decision?'
                placeholderTextColor='grey'
                style={styles.textInput} 
                value={props.textInput}
                onChangeText={props.handleTextInput}
                autoCorrect={true}
                autoCapitalize='words'
                />
            <CustomButton
                title='Create'
                handlePress={props.decisionPress}
                containerStyles='mt-5 bg-green-500'
                isLoading={props.isSubmitting}
                textStyles='text-base font-medium text-white'
            />
        </View>
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
  

export default CreateTaskBottomSheetModal