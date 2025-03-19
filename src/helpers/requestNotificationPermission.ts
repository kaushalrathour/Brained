import notifee from "@notifee/react-native"
export default async function requestNotificationPermission() {
    try {
        const result = await notifee.requestPermission();
        if(result.authorizationStatus === 0) return false;
        return true
    } catch (error) {
        return false;
    }
}