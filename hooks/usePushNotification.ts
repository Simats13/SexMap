import { useState, useEffect } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface UserData {
  friendsList?: string[];
  display_name?: string;
  expoPushToken?: string;
}

export const usePushNotification = (userId?: string) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      return;
    }

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        return;
      }

      // Obtenir le token Expo
      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });

      setExpoPushToken(token);

      // Si l'utilisateur est connecté, mettre à jour son token dans Firestore
      if (userId) {
        await updateDoc(doc(db, "users", userId), {
          expoPushToken: token,
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des notifications:",
        error
      );
    }
  };

  const sendPushNotification = async (
    userIds: string[],
    title: string,
    body: string,
    data?: any
  ) => {
    try {
      // Récupérer les tokens des utilisateurs
      const userTokens = await Promise.all(
        userIds.map(async (uid) => {
          const userDoc = await getDoc(doc(db, "users", uid));
          const userData = userDoc.data() as UserData;
          return userData.expoPushToken;
        })
      );

      // Filtrer les tokens null/undefined
      const validTokens = userTokens.filter(
        (token): token is string => !!token
      );

      // Envoyer les notifications via l'API Expo
      await Promise.all(
        validTokens.map(async (token) => {
          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: token,
              title,
              body,
              data,
              sound: "default",
              priority: "high",
            }),
          });
        })
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi des notifications:", error);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, [userId]);

  return {
    expoPushToken,
    sendPushNotification,
  };
};
