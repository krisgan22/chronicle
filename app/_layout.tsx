import AppwriteProvider from "@/appwrite_backend/AppwriteContext";
import { StatusBar } from "expo-status-bar";
import { SplashScreen, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
    "Inter-BlackItalic": require("../assets/fonts/Inter-BlackItalic.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-BoldItalic": require("../assets/fonts/Inter-BoldItalic.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-ExtraBoldItalic": require("../assets/fonts/Inter-ExtraBoldItalic.ttf"),
    "Inter-ExtraLight": require("../assets/fonts/Inter-ExtraLight.ttf"),
    "Inter-ExtraLightItalic": require("../assets/fonts/Inter-ExtraLightItalic.ttf"),
    "Inter-Italic": require("../assets/fonts/Inter-Italic.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
    "Inter-LightItalic": require("../assets/fonts/Inter-LightItalic.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-MediumItalic": require("../assets/fonts/Inter-MediumItalic.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-SemiBoldItalic": require("../assets/fonts/Inter-SemiBoldItalic.ttf"),
    "Inter-Thin": require("../assets/fonts/Inter-Thin.ttf"),
    "Inter-ThinItalic": require("../assets/fonts/Inter-ThinItalic.ttf"),
    "InterDisplay-Black": require("../assets/fonts/InterDisplay-Black.ttf"),
    "InterDisplay-BlackItalic": require("../assets/fonts/InterDisplay-BlackItalic.ttf"),
    "InterDisplay-Bold": require("../assets/fonts/InterDisplay-Bold.ttf"),
    "InterDisplay-BoldItalic": require("../assets/fonts/InterDisplay-BoldItalic.ttf"),
    "InterDisplay-ExtraBold": require("../assets/fonts/InterDisplay-ExtraBold.ttf"),
    "InterDisplay-ExtraBoldItalic": require("../assets/fonts/InterDisplay-ExtraBoldItalic.ttf"),
    "InterDisplay-ExtraLight": require("../assets/fonts/InterDisplay-ExtraLight.ttf"),
    "InterDisplay-ExtraLightItalic": require("../assets/fonts/InterDisplay-ExtraLightItalic.ttf"),
    "InterDisplay-Italic": require("../assets/fonts/InterDisplay-Italic.ttf"),
    "InterDisplay-Light": require("../assets/fonts/InterDisplay-Light.ttf"),
    "InterDisplay-LightItalic": require("../assets/fonts/InterDisplay-LightItalic.ttf"),
    "InterDisplay-Medium": require("../assets/fonts/InterDisplay-Medium.ttf")
  })

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();

  }, [fontsLoaded, error])
  
  if (!fontsLoaded && !error) return null;

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
