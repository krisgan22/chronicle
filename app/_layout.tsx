import AppwriteProvider from "@/appwrite_backend/AppwriteContext";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
    <BottomSheetModalProvider>
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
        <Stack.Screen name={`joinedOrg/members/viewMemberDetails`} options={{headerShown: false}} />
        <Stack.Screen name={`joinedOrg/manageSubmitted/[orgName]`} options={{headerShown: false}} />
        <Stack.Screen name={`joinedOrg/manageTasks/[orgName]`} options={{headerShown: false}} />
        <Stack.Screen name={`joinedOrg/viewTaskDetails/[taskID]`} options={{headerShown: false}} />
      </Stack>
      <StatusBar style="dark"></StatusBar>
    </AppwriteProvider>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
