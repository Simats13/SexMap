import { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeviceId } from "@/hooks/useDeviceId";
import { FilterProvider } from "@/contexts/FilterContext";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Composant séparé pour la configuration des notifications
function NotificationSetup() {
  useEffect(() => {
    // Configuration des notifications pour iOS
    if (Platform.OS === "ios") {
      Notifications.setNotificationCategoryAsync("default", [
        {
          identifier: "default",
          buttonTitle: "Ouvrir",
        },
      ]);
    }

    // Configuration du canal de notification pour Android
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // Configuration des listeners de notification
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification reçue:", notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Réponse à la notification:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return null;
}

export default function RootLayout() {
  const { loading: deviceIdLoading } = useDeviceId();

  if (deviceIdLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <NotificationSetup />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modals/addSex"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="modals/auth"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="modals/showSex"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="modals/filters"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="modals/friendsList"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
      </FilterProvider>
    </QueryClientProvider>
  );
}
