import { View, Text, Modal, StyleSheet } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

type ConfirmModalProps = {
    confirmModalVisible: boolean,
    setConfirmModalVisible: ((item: boolean) => void),
    handleSubmit: ((...args: any[]) => any),
    modalText: string,
}

const ConfirmModal = ({confirmModalVisible, setConfirmModalVisible, handleSubmit, modalText}: ConfirmModalProps) => {
  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => {
            setConfirmModalVisible(!confirmModalVisible);
        }}>
        <View style={styles.modalBackground}>
            <View style={styles.modalView}>
                <Text className='text-base text-center'>{modalText}</Text>
                <View className='flex-row'>
                    <CustomButton
                        handlePress={() => setConfirmModalVisible(!confirmModalVisible)}
                        title='Cancel'
                        textStyles='text-base text-red-600 mx-10'
                        >
                    </CustomButton>
                    <CustomButton
                        handlePress={handleSubmit}
                        title='Confirm'
                        textStyles='text-base text-green-600 mx-10'
                        >
                    </CustomButton>
                </View>
            </View>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 30,
      paddingBottom: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dark overlay with 50% opacity
    },
});

export default ConfirmModal