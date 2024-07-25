import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Tabs, Redirect } from 'expo-router'
import { Feather, Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


type TabIconType = {
    icon: React.ReactElement,
    color: any,
    name: any,
    focused: any
}

const TabIcon = ({icon, color, name, focused }: TabIconType) => {
    return (
        <View>
            {React.cloneElement(icon, { color: color || icon.props.color })}
        </View>
    )
}

export default function TabsLayout() {
  return (
    <>
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#000000",
                tabBarInactiveTintColor: "#b0b0b0"
            }}
        >
            <Tabs.Screen
                name='home'
                options={{
                    title: "Search",
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (<TabIcon
                        icon={<Ionicons name="search" size={24} color="black" />}
                        color={color}
                        name="Home"
                        focused={focused} />
                    )
                }}
            ></Tabs.Screen>
            <Tabs.Screen
                name='orgs'
                options={{
                    title: "Organizations",
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (<TabIcon
                        icon={<Octicons name="organization" size={20} color="black" />}
                        color={color}
                        name="Home"
                        focused={focused} />
                    )
                }} 
            ></Tabs.Screen>
            <Tabs.Screen
                name='profile'
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (<TabIcon
                        icon={<Feather name="user" size={24} color="black" />}
                        color={color}
                        name="Home"
                        focused={focused} />
                    )
                }}
            ></Tabs.Screen>
        </Tabs>
        <StatusBar style='dark'></StatusBar>
    </>
  )
}