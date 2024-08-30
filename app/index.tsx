import { Text, View, ActivityIndicator } from "react-native";
import { Link, Redirect } from 'expo-router';
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppwriteContext } from "@/appwrite_backend/AppwriteContext";
import { StatusBar } from 'expo-status-bar'

export default function Index() {
  const { isLoading, isSignedIn } = useAppwriteContext();

  // Show a loading indicator while checking sign-in status
  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size="large" color="#0000ff" />
        <StatusBar style='dark'></StatusBar>
      </SafeAreaView>
    );
  }

  // Redirect if user is signed in
  if (isSignedIn) {
    return <Redirect href={"/home"} />;
  }

  // Show welcome screen if the user is not signed in
  return (
    <SafeAreaView className='flex-1 justify-center items-center bg-white'>
      <Text className="text-3xl font-bold">Welcome to Chronicle</Text>
      <Link className="text-xl" href="/sign-in">Go To Sign-In</Link>
      <StatusBar style='dark'></StatusBar>
    </SafeAreaView>
  );
}