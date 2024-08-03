import AppwriteProvider from "@/appwrite_backend/AppwriteContext";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AppwriteProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}}/>
        <Stack.Screen name="(auth)" options={{headerShown: false}}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name={`viewOrg/[orgName]`} options={{headerShown: false}} />
        <Stack.Screen name={`joinedOrg/[orgName]`} options={{headerShown: false}} />
        <Stack.Screen name={`joinedOrg/timesheet/[orgName]`} options={{headerShown: false}} />
        <Stack.Screen name={`joinedOrg/submitted/[orgName]`} options={{headerShown: false}} />
        <Stack.Screen name={`joinedOrg/submitted/edit/[taskID]`} options={{headerShown: false}} />
        <Stack.Screen name={`joinedOrg/members/manageMembers`} options={{headerShown: false}} />
      </Stack>
      <StatusBar style="dark"></StatusBar>
    </AppwriteProvider>
  );
}
