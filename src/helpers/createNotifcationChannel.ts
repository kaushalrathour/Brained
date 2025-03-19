import notifee, {AndroidImportance } from "@notifee/react-native"
export default async function createNotificationChannel() {
    await notifee.createChannel({
          id: 'push-notification',
          name: 'Push Notification',
          importance: AndroidImportance.HIGH,
        });
}