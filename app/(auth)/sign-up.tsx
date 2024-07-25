import { View, Text, ScrollView, Alert} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import CustomButton from '@/components/CustomButton'

import { signUpAccount } from '@/appwrite_backend/service'
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext'
import Loading from '@/components/Loading'
import PasswordField from '@/components/PasswordField'

export default function SignUp() {
  const {setUser, setIsSignedIn} = useAppwriteContext();

  const [form, setForm] = useState(
    {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_num: '',
      employer: '',
      matching_rate: '',
      password: ''
    }
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!form.username || 
        !form.first_name || 
        !form.last_name ||
        !form.email || 
        !form.phone_num ||
        !form.employer || 
        !form.matching_rate ||
        !form.password
    ) {
      Alert.alert("Error", "Please fill in all the fields");
    }
   
    else
    {
      setIsSubmitting(true);
      try {
        const result = await signUpAccount(form.email, form.password, form.username, form.first_name, form.last_name, form.phone_num, form.employer, parseFloat(form.matching_rate));
        if (result)
        {
          // set to global state
          setUser(result);
          setIsSignedIn(true);

          router.replace('/home');
        } else {
          Alert.alert("A user with that email or username already exists");
        }
      } catch (error) {
        Alert.alert("Error", "Could not create account, try again")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // const submit = async () => {
  //       if (!form.username || 
  //       !form.first_name || 
  //       !form.last_name ||
  //       !form.email || 
  //       !form.phone_num ||
  //       !form.employer || 
  //       !form.matching_rate ||
  //       !form.password
  //   ) {
  //     Alert.alert("Error", "Please fill in all the fields");
  //   }
    
  //   setIsSubmitting(true);
  //   try {
  //     const newAccount = await account.create(ID.unique(), form.email, form.password, form.username);
  //     if (newAccount) {
  //         // sign in and create email session
  //         if (newAccount) {
  //             //await signInAccountCreateSession(form.email, form.password);
              
  //             // create instance of user in database with attributes too
  //             const newUser = await databases.createDocument(
  //                 DATABASE_ID, 
  //                 USERS_COLLECTION_ID, 
  //                 ID.unique(), 
  //                 {
  //                     userID: newAccount.$id,
  //                     first_name: form.first_name,
  //                     last_name: form.last_name,
  //                     user_name: form.username,
  //                     phone_num: form.phone_num,
  //                     email: form.email,
  //                     employer:form.employer,
  //                     matching_rate: form.matching_rate
  //                 });
              
  //             return newUser;

  //         } else 
  //         {
  //             return newAccount;
  //         }
  //     }
  //   } catch (error) {
  //       console.log("Appwrite: signUpAccount(): ", error);
  //       // Snackbar.show({text: String(error), duration: Snackbar.LENGTH_LONG}); 
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <SafeAreaView >
      <ScrollView
        indicatorStyle='black'
        className='h-full mx-1'
      >
        <Text className="mt-3 font-semibold text-3xl">Sign Up</Text>
        <FormField 
          title="Username"
          value={form.username}
          handleChangeText={(e) => setForm({...form, username: e})}
          styleOptions='mx-4'
        />
        <FormField 
          title="First Name"
          value={form.first_name}
          handleChangeText={(e) => setForm({...form, first_name: e})}
          styleOptions='mx-4'
        />
        <FormField 
          title="Last Name"
          value={form.last_name}
          handleChangeText={(e) => setForm({...form, last_name: e})}
          styleOptions='mx-4'
        />
        <FormField 
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({...form, email: e})}
          styleOptions='mx-4'
        />
        <FormField 
          title="Phone Number"
          value={form.phone_num}
          handleChangeText={(e) => setForm({...form, phone_num: e})}
          styleOptions='mx-4'
        />
        <FormField 
          title="Employer"
          value={form.employer}
          handleChangeText={(e) => setForm({...form, employer: e})}
          styleOptions='mx-4'
        />
        <FormField 
          title="Matching Rate"
          value={form.matching_rate}
          handleChangeText={(e) => setForm({...form, matching_rate: e})}
          styleOptions='mx-4'
        />
        <PasswordField 
          title="Password"
          value={form.password}
          handleChangeText={(e) => setForm({...form, password: e})}
          styleOptions='mx-4'
        />

        <CustomButton
          title='Sign Up'
          handlePress={submit}
          containerStyles='mt-7 mx-4 bg-black'
          isLoading={isSubmitting}
          textStyles='text-base font-medium text-white'
        />

        <Link href="/sign-in" className='mt-5 mx-4'>Click here to go back to Sign-in</Link>
        {isSubmitting == true ? <Loading></Loading> : null}
      </ScrollView>
      <StatusBar style="dark"></StatusBar>
    </SafeAreaView>
  )
}