import { Text, View } from "react-native";
import { Link, Redirect } from 'expo-router';
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppwriteContext } from "@/appwrite_backend/AppwriteContext";
import { StatusBar } from 'expo-status-bar'

export default function Index() {
  const {isLoading, isSignedIn} = useAppwriteContext();

  if (!isLoading && isSignedIn) return <Redirect href={"/home"} />;

  return (
    <SafeAreaView className='flex-1 justify-center items-center bg-white'>
      <Text className="text-3xl font-bold">Welcome to Chronicle</Text>
      <Link className="text-xl" href="/sign-in">Go To Sign-In</Link>
      <StatusBar style='dark'></StatusBar>
    </SafeAreaView>
  );
}
