import { View, Text } from 'react-native'
import React, { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser } from './service';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppContext = {
  isSignedIn: boolean,
  setIsSignedIn: (isSignedIn: boolean) => void,
  user: any,
  setUser: (user: any) => void,
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
}

const AppwriteContext = createContext<AppContext | null>(null);

// export const useAppwriteContext = () => useContext(AppwriteContext);

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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // useEffect(() => {
    //   getCurrentUser()
    //   .then((res) => {
    //     if (res) {
    //       setIsSignedIn(true);
    //       setUser(res);
    //     }
    //     else
    //     {
    //       setIsSignedIn(false);
    //       setUser(null);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("AppwriteContext: useEffect: ", error)
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   })
    // }, [])

    useEffect(() => {
      const loadUser = async () => {
        try {
          const savedUser = await AsyncStorage.getItem('user');
          if (savedUser) {
            console.log("Async Storage retrieval successful: ", savedUser)
            setUser(JSON.parse(savedUser));
            setIsSignedIn(true);
          } else {
            console.log("Initialized welcomeMsg variable");
            console.log("Async Storage retrieval unsuccessful: ", savedUser);
            const currentUser = await getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              setIsSignedIn(true);
              await AsyncStorage.setItem('user', JSON.stringify(currentUser));
              console.log("Async Storage write successful: ", currentUser)
            } else {
              setIsSignedIn(false);
            }
          }
        } catch (error) {
          console.error("AppwriteContext: useEffect: ", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      loadUser();
    }, []);

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
  
    return (
    <AppwriteContext.Provider 
      value={{
        isSignedIn,
        setIsSignedIn,
        user,
        setUser,
        isLoading,
        setIsLoading
      }}>
      {children}
    </AppwriteContext.Provider>
  )
}

export default AppwriteProvider