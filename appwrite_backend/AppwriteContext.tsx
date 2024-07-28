import { View, Text } from 'react-native'
import React, { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { getCurrentSession, getCurrentUser } from './service';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppContext = {
  isSignedIn: boolean,
  setIsSignedIn: (isSignedIn: boolean) => void,
  user: any,
  setUser: (user: any) => void,
  userDetails: any,
  setUserDetails: (userDetails: any) => void,
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
}

const AppwriteContext = createContext<AppContext | null>(null);

export const useAppwriteContext = () => {
  const context = useContext(AppwriteContext);
  if (!context) {
    throw new Error("AppwriteContext: useAppwriteContext(): useAppwriteContext() must be used within an AppwriteProvider")
  }
  return context;
};

const AppwriteProvider: FC<PropsWithChildren> = ({children}) => {
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);
    const [userDetails, setUserDetails] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // User session loading
    useEffect(() => {
      const loadUser = async () => {
        try {
          const savedUser = await AsyncStorage.getItem('user');
          if (savedUser) {
            console.log("Async Storage currentUser retrieval successful: ", savedUser)
            setUser(JSON.parse(savedUser));
            setIsSignedIn(true);
          } else {
            console.log("Initialized welcomeMsg variable");
            console.log("Async Storage currentUser retrieval unsuccessful: ", savedUser);
            const currentUser = await getCurrentSession();
            if (currentUser) {
              setUser(currentUser);
              setIsSignedIn(true);
              await AsyncStorage.setItem('user', JSON.stringify(currentUser));
              console.log("Async Storage currentUser write successful: ", currentUser)
            } else {
              setIsSignedIn(false);
            }
          }
        } catch (error) {
          console.error("AppwriteContext: useEffect(): loadUser():", error);
        } finally {
          setIsLoading(false);
        }
        
      };
  
      loadUser();
    }, []);

    // User session saving
    useEffect(() => {
      const saveUser = async () => {
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
          console.log("Async Storage write successful: ", user)
        } else {
          await AsyncStorage.removeItem('user');
        }
      };
  
      saveUser();
    }, [user]);

    // User details loading
    useEffect(() => {
      const loadUserDetails = async () => {
        try {
          const savedUserDetails = await AsyncStorage.getItem('userDetails');
          if (savedUserDetails) {
            console.log("Async Storage currentUserDetails retrieval successful: ", savedUserDetails)
            setUserDetails(JSON.parse(savedUserDetails));
            setIsSignedIn(true);
          } else {
            console.log("Initialized welcomeMsg variable");
            console.log("Async Storage currentUserDetails retrieval unsuccessful: ", savedUserDetails);
            const currentUserDetails = await getCurrentUser();
            if (currentUserDetails) {
              setUserDetails(currentUserDetails);
              setIsSignedIn(true);
              await AsyncStorage.setItem('userDetails', JSON.stringify(currentUserDetails));
              console.log("Async Storage currentUserDetails write successful: ", currentUserDetails)
            } else {
              setIsSignedIn(false);
            }
          }
        } catch (error) {
          console.error("AppwriteContext: useEffect(): loadUserDetails():", error);
        } finally {
          setIsLoading(false);
        }
        
      };
  
      loadUserDetails();
    }, []);

    
    // User details saving
    useEffect(() => {
      const saveUserDetails = async () => {
        if (userDetails) {
          await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
          console.log("Async Storage currentUserDetails write successful: ", userDetails)
        } else {
          await AsyncStorage.removeItem('userDetails');
        }
      };
  
      saveUserDetails();
    }, [userDetails]);
  
    return (
    <AppwriteContext.Provider 
      value={{
        isSignedIn,
        setIsSignedIn,
        user,
        setUser,
        userDetails,
        setUserDetails,
        isLoading,
        setIsLoading
      }}>
      {children}
    </AppwriteContext.Provider>
  )
}

export default AppwriteProvider