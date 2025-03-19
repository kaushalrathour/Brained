import React, { useEffect } from "react";
import { LogBox, PermissionsAndroid } from "react-native";
import NavigationContainer from "./NavigationContainer";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { webClientId } from "@env";
import { messaging } from "./firebaseConfig";
import notifee from "@notifee/react-native";
import createNotificationChannel from "./helpers/createNotifcationChannel";
import requestNotificationPermission from "./helpers/requestNotificationPermission";

function handleDisplayNotification(id, title, body, imageUrl) {
  notifee.displayNotification({
    id,
    title,
    body,
    android: {
      channelId: "push-notification",
      largeIcon: imageUrl
    },
  });
}

export default function App(): React.JSX.Element {
  GoogleSignin.configure({
    webClientId,
    offlineAccess: true,
  });

  async function fetchToken() {
    try {
      const token = await messaging.getToken();
      console.log("FCM Token:", token);
      const enabled = await requestNotificationPermission();
      if (enabled) {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    } catch (error) {
      console.error("Error fetching FCM token:", error);
    }
  }

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']);
    createNotificationChannel();
    fetchToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging.onMessage(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification;
      const {imageUrl} = remoteMessage.notification?.android
      const { messageId } = remoteMessage;
      console.log("Notification received:", title);
      handleDisplayNotification(messageId, title, body, imageUrl);
    });
    return unsubscribe;
  }, []);


  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
