import { View, Text, TextInput, Platform } from 'react-native';
import React from 'react';

type FormFieldProps = {
    title: string | undefined,
    value: string | undefined,
    handleChangeText: ((e : any) => any) | undefined,
    placeholder?: string | undefined,
    styleOptions?: string | undefined
}

export default function FormFieldTextArea({title, value, handleChangeText, placeholder, styleOptions}: FormFieldProps) {
  return (
    <View className={`space-y-2 ${styleOptions}`}>
      {title && <Text>{title}</Text>}
      <View className='h-20 border border-black w-full px-2 rounded-lg items-center flex-row'>
        <TextInput 
            className='text-base flex-1 p-0 ' 
            value={value}
            placeholder={placeholder} 
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            style={Platform.OS === 'ios' && ({ paddingTop: 0, paddingBottom: 50})}
            >
            </TextInput>
      </View>
    </View>
  );
}

// import { View, Text, TextInput, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from 'react-native';
// import React, { useState } from 'react';

// type FormFieldProps = {
//     title: string | undefined,
//     value: string | undefined,
//     handleChangeText: ((e : any) => any) | undefined,
//     placeholder?: string | undefined,
//     styleOptions?: string | undefined
// }

// export default function FormFieldTextArea({title, value, handleChangeText, placeholder, styleOptions}: FormFieldProps) {
//   const [height, setHeight] = useState(40); // Initial height
//   const maxHeight = 100; // Maximum height
  
//   // Handle content size change
//   const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
//     const contentHeight = event.nativeEvent.contentSize.height;
//     // Update height based on contentHeight but do not exceed maxHeight
//     setHeight(Math.min(contentHeight, maxHeight));
//   };
  
//   return (
//     <View className={`space-y-2 ${styleOptions}`}>
//       <Text>{title}</Text>
//       <View className="flex-1 justify-center items-center p-4">
//       <TextInput
//         multiline
//         onContentSizeChange={handleContentSizeChange}
//         className="w-full border border-gray-300 p-2"
//         style={{ height }}
//         placeholder="Type something..."
//         textAlignVertical="top" // Ensures text starts from the top
//       />
//     </View>
//     </View>
//   );
// }

