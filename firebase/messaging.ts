// firebase/messaging.js
import messaging, { FirebaseMessagingTypes, getMessaging } from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

// Request permission for iOS devices
export async function requestUserPermission() {
  // if (Platform.OS === 'ios') {
  //   const authStatus = await getMessaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   return enabled;
  // }
  const authStatus = await getMessaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  console.log(enabled)
  
  return true; // Android doesn't need explicit permission for FCM
}

// Get the FCM token
export async function getFCMToken() {
  try {
    await requestUserPermission();
    const token = await getMessaging().getToken();
    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', JSON.stringify(error));
    return null;
  }
}

// Register background handler
export async function registerBackgroundHandler(callback: (message: FirebaseMessagingTypes.RemoteMessage) => any) {
  return getMessaging().setBackgroundMessageHandler(async remoteMessage => {
    await callback(remoteMessage)
  });
}

// Handle foreground messages
export function onMessage(callback: (message: FirebaseMessagingTypes.RemoteMessage) => any) {
  return getMessaging().onMessage(callback);
}

// Handle notification open events
export function onNotificationOpenedApp(callback: (message: FirebaseMessagingTypes.RemoteMessage) => any) {
  return getMessaging().onNotificationOpenedApp(callback);
}

// Check if app was opened from a notification
export async function getInitialNotification() {
  return await getMessaging().getInitialNotification();
}