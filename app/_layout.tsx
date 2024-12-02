import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterProvider } from "@/contexts/FilterContext";
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
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

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Configuration des notifications pour iOS
    if (Platform.OS === "ios") {
      Notifications.setNotificationCategoryAsync("achievement", [
        {
          identifier: "view",
          buttonTitle: "Voir",
          options: {
            opensAppToForeground: true,
          },
        },
      ]);
    }

    // Gestionnaire de réponse aux notifications
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (response.notification.request.content.data?.type === "achievement") {
          router.push("/success");
        }
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modals/friendsList"
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
            name="modals/addSex"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="modals/locationsList"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
      </FilterProvider>
    </QueryClientProvider>
  );
}
