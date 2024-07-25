// import React, { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
// import { getCurrentUser } from './service';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type AppContextType = {
//   isSignedIn: boolean;
//   setIsSignedIn: (isSignedIn: boolean) => void;
//   user: any | null;
//   setUser: (user: any | null) => void;
//   isLoading: boolean;
//   setIsLoading: (isLoading: boolean) => void;
// };

// const AppwriteContext = createContext<AppContextType | null>(null);

// export const useAppwriteContext = () => {
//   const context = useContext(AppwriteContext);
//   if (!context) {
//     throw new Error('useAppwriteContext must be used within an AppwriteProvider');
//   }
//   return context;
// };

// const AppwriteProvider: FC<PropsWithChildren> = ({ children }) => {
//   const [isSignedIn, setIsSignedIn] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const savedUser = await AsyncStorage.getItem('user');
//         if (savedUser) {
//           setUser(JSON.parse(savedUser));
//           setIsSignedIn(true);
//         } else {
//           const currentUser = await getCurrentUser();
//           if (currentUser) {
//             setUser(currentUser);
//             setIsSignedIn(true);
//             await AsyncStorage.setItem('user', JSON.stringify(currentUser));
//           } else {
//             setIsSignedIn(false);
//           }
//         }
//       } catch (error) {
//         console.error("AppwriteContext: useEffect: ", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   useEffect(() => {
//     const saveUser = async () => {
//       if (user) {
//         await AsyncStorage.setItem('user', JSON.stringify(user));
//       } else {
//         await AsyncStorage.removeItem('user');
//       }
//     };

//     saveUser();
//   }, [user]);

//   return (
//     <AppwriteContext.Provider
//       value={{
//         isSignedIn,
//         setIsSignedIn,
//         user,
//         setUser,
//         isLoading,
//         setIsLoading,
//       }}
//     >
//       {children}
//     </AppwriteContext.Provider>
//   );
// };

// export default AppwriteProvider;
