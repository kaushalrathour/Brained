import { initializeApp } from "@react-native-firebase/app";
import  {getMessaging} from "@react-native-firebase/messaging";
import {apiKey, projectId, messagingSenderId, appId, authDomain} from "@env"

const credentials = { apiKey, projectId, messagingSenderId, appId,authDomain};

const app = initializeApp(credentials);

export const messaging = getMessaging(app)
