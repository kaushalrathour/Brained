import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { messaging } from './src/firebaseConfig';

messaging.setBackgroundMessageHandler(async (remoteMessage) => {});

AppRegistry.registerComponent(appName, () => App);
