import { View, Text, StyleSheet } from 'react-native'
import React, { forwardRef, useMemo } from 'react'
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import CustomButton from './CustomButton'

type Props = {
    textInput: string,
    handleTextInput:  ((e : any) => any),
    decisionPress: ((taskID: string, decision: string, reason: string) => any),
    isSubmitting?: boolean,
    taskID: string,
}

type Ref = BottomSheetModal


const DecisionBottomSheetModal = forwardRef<Ref, Props>((props, ref) => {
    const snapPoints = useMemo(() => ["30%"], []);
  return (
    <BottomSheetModal 
        ref={ref}
        snapPoints={snapPoints}
        
        >
        <View className='mx-5'>
            <Text className='my-2 font-medium'>Decision Reason (Optional)</Text>
            <BottomSheetTextInput 
                placeholder='Why did you choose this decision?'
                placeholderTextColor='grey'
                style={styles.textInput} 
                value={props.textInput}
                onChangeText={props.handleTextInput}
                autoCorrect={true}
                />
            <CustomButton
                title='Reject'
                handlePress={() => props.decisionPress(props.taskID, "rejected", props.textInput)}
                containerStyles='mt-5 bg-rose-700'
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
  

export default DecisionBottomSheetModal