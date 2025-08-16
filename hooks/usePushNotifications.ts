// File: hooks/usePushNotifications.ts

import * as Notifications from "expo-notifications";
import { Notification, NotificationResponse } from "expo-notifications";
import { useEffect, useState } from "react";

// --- HOOK PER LE NOTIFICHE PUSH ---
async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.error("Failed to get push token for push notification!");
    return;
  }

  // Utilizza 'const' dato che la variabile non viene riassegnata
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Push token:", token);
  return token;
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
  useEffect(() => {
    // Aggiungi un blocco .catch() per gestire gli errori della Promise
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token))
      .catch((error) => console.error("Error registering for push notifications:", error));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification: Notification) => {
        console.log("Notifica ricevuta:", notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        (response: NotificationResponse) => {
          console.log("Interazione con notifica:", response);
        },
      );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  };

  return { expoPushToken, sendNotification };
}


/*
// File: hooks/usePushNotifications.ts

import * as Notifications from "expo-notifications";
import { Notification, NotificationResponse } from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

// --- HOOK PER LE NOTIFICHE PUSH ---
async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.error("Failed to get push token for push notification!");
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Push token:", token);
  return token;
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token),
    );
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification: Notification) => {
        console.log("Notifica ricevuta:", notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        (response: NotificationResponse) => {
          console.log("Interazione con notifica:", response);
        },
      );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  };

  return { expoPushToken, sendNotification };
}
*/
