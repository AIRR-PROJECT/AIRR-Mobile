// // firebase/messaging.js
// import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
// import { Alert, Platform } from 'react-native';

// // Request permission for iOS devices
// export async function requestUserPermission() {
//   if (Platform.OS === 'ios') {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     return enabled;
//   }
  
//   return true; // Android doesn't need explicit permission for FCM
// }

// // Get the FCM token
// export async function getFCMToken() {
//   try {
//     await requestUserPermission();
//     const token = await messaging().getToken();
//     Alert.alert("Token retrieved", token)
//     return token;
//   } catch (error) {
//     Alert.alert('Failed to get FCM token:', JSON.stringify(error));
//     return null;
//   }
// }

// // Register background handler
// export function registerBackgroundHandler() {
//   return messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background:', remoteMessage);
//   });
// }

// // Handle foreground messages
// export function onMessage(callback: (message: FirebaseMessagingTypes.RemoteMessage) => any) {
//   return messaging().onMessage(callback);
// }

// // Handle notification open events
// export function onNotificationOpenedApp(callback: (message: FirebaseMessagingTypes.RemoteMessage) => any) {
//   return messaging().onNotificationOpenedApp(callback);
// }

// // Check if app was opened from a notification
// export async function getInitialNotification() {
//   return await messaging().getInitialNotification();
// }