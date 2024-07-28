import { View, Text, ScrollView, Alert} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '@/components/CustomButton';
import Loading from '@/components/Loading';

import { signInAccountCreateSession } from '@/appwrite_backend/service'
import { useAppwriteContext } from '@/appwrite_backend/AppwriteContext'
import PasswordField from '@/components/PasswordField';

export default function SignIn() {


  const {setUser, setUserDetails, setIsSignedIn} = useAppwriteContext();
  const [form, setForm] = useState(
    {
      email_or_username: '',
      password: ''
    }
  )
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const submit = async () => {
    if (!form.email_or_username || 
        !form.password
    ) {
      Alert.alert("Error", "Please fill in all the fields");
    }
   
    else
    {
      setIsSubmitting(true);
      try {
        const result = await signInAccountCreateSession(form.email_or_username, form.password);
        // console.log("sign-in.tsx: signInAccountCreatSession(): ", result);
        if (result) {
          // set to global state
          
          setUser(result.session);
          setUserDetails(result.user);
          setIsSignedIn(true);
          router.replace('/home');
        } else {
          Alert.alert("Error", "Incorrect credentials")
        }
      } catch (error) {
        console.log("sign-in: signInAccountCreateSession(): ", error);
      } finally {
        setIsSubmitting(false)
      }
    }
  }
  
  return (
    <SafeAreaView className='h-full mx-5'>
      <ScrollView>
      <Text className="mt-20 font-semibold text-3xl">Welcome to Chronicle!</Text>
        <Text className="mt-20 font-semibold text-3xl">Sign In</Text>
        <FormField 
          title="Email or Username"
          value={form.email_or_username}
          handleChangeText={(e) => setForm({...form, email_or_username: e})}
          styleOptions='mt-5'
        />
        <PasswordField
          title="Password"
          value={form.password}
          handleChangeText={(e) => setForm({...form, password: e})}
          styleOptions='mt-5'
        />
        <CustomButton
          title='Sign In'
          handlePress={submit}
          containerStyles='mt-7 bg-black'
          isLoading={isSubmitting}
          textStyles='text-base font-medium text-white'
        />
        {isSubmitting == true ? <Loading></Loading> : null}
        <Link href="/sign-up" className='mt-5'>Click here to Sign-Up</Link>
      </ScrollView>

      <StatusBar style="dark"></StatusBar>
    </SafeAreaView>
  )
}