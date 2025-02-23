import React, { useEffect } from "react";
import { LogBox, View } from "react-native";
import NavigationContainer from "./NavigationContainer";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function App(): React.JSX.Element{
  GoogleSignin.configure({
    webClientId: '717223895231-7uvhttkd1jh90lvkq00n05sh62gin7j4.apps.googleusercontent.com',
    offlineAccess: true, 
  });
  useEffect(()=>{
    LogBox.ignoreAllLogs();
  },[])
  return (
    <Provider store={store}>
      <NavigationContainer/>
  </Provider>
  )
}