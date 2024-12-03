import { Stack, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import * as Linking from "expo-linking";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterProvider } from "@/contexts/FilterContext";
import * as Notifications from 'expo-notifications';
import { Platform, View, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { FadeIn } from 'react-native-reanimated';
import CustomSplash from '@/components/SplashScreen';
import * as Updates from 'expo-updates';

// Maintenir le splash screen visible pendant le chargement
SplashScreen.preventAutoHideAsync();

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
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Configuration iOS
        if (Platform.OS === "ios") {
          await Notifications.setNotificationCategoryAsync("achievement", [
            {
              identifier: "view",
              buttonTitle: "Voir",
              options: { opensAppToForeground: true },
            },
          ]);
        }

        // Important: Attendre un moment avant de cacher le splash natif
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Cacher le splash natif
        await SplashScreen.hideAsync().catch(console.warn);
        
        setAppIsReady(true);
        
        // Laisser le custom splash visible un moment
        await new Promise(resolve => setTimeout(resolve, 2500));
        setShowCustomSplash(false);
        
      } catch (e) {
        console.warn(e);
        setAppIsReady(true);
        setShowCustomSplash(false);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    checkForUpdates();
  }, []);

  async function checkForUpdates() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          'Mise à jour disponible',
          'Une nouvelle version est disponible. Voulez-vous mettre à jour maintenant ?',
          [
            { text: 'Plus tard', style: 'cancel' },
            {
              text: 'Mettre à jour',
              onPress: async () => {
                try {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                } catch (error) {
                  Alert.alert('Erreur', 'Impossible de mettre à jour l\'application');
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.log('Erreur lors de la vérification des mises à jour:', error);
    }
  }

  // Afficher rien pendant le chargement initial
  if (!appIsReady) {
    return null;
  }

  // Afficher le splash screen personnalisé
  if (showCustomSplash) {
    return <CustomSplash />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <Animated.View 
          style={{ flex: 1 }}
          entering={FadeIn.duration(1000)}
        >
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
              name="modals/filters"
              options={{
                presentation: "modal",
                headerShown: false,
                animation: "slide_from_bottom",
              }}
            />
          </Stack>
        </Animated.View>
      </FilterProvider>
    </QueryClientProvider>
  );
}
