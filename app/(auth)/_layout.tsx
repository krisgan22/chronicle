import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

export default function AuthLayout() {
  return (
    <>
        <Stack>
            <Stack.Screen
                name='sign-in' options={{headerShown: false}}
            ></Stack.Screen>

            <Stack.Screen
                name='sign-up' options={{headerShown: false}}
            ></Stack.Screen>
            
            <Stack.Screen
                name='sign-up-names' options={{headerShown: false}}
            ></Stack.Screen>

            <Stack.Screen
                name='sign-up-id' options={{headerShown: false}}
            ></Stack.Screen>

            <Stack.Screen
                name='sign-up-employer' options={{headerShown: false}}
            ></Stack.Screen>

            <Stack.Screen
                name='sign-up-password' options={{headerShown: false}}
            ></Stack.Screen>
        </Stack>
        
        <StatusBar style='dark'></StatusBar>
    </>
  )
}