import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text, Alert, Platform } from "react-native";

import { usePathname } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { TabBar } from "@/components/navigation/TabBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { usePushNotification } from "@/hooks/usePushNotification";
import * as Notifications from "expo-notifications";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const { data: user } = useAuth();
  const { expoPushToken } = usePushNotification(user?.uid);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Platform.OS === "ios") {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        if (existingStatus === "granted") return;

        Alert.alert(
          "Notifications",
          "Voulez-vous recevoir des notifications quand vos amis ajoutent un pin ?",
          [
            {
              text: "Non merci",
              style: "cancel",
            },
            {
              text: "Oui",
              onPress: async () => {
                await Notifications.requestPermissionsAsync();
              },
            },
          ],
          { cancelable: true }
        );
      } else {
        // Pour Android, la demande est gérée automatiquement par le système
        await Notifications.requestPermissionsAsync();
      }
    };

    // Demander l'autorisation seulement si l'utilisateur est connecté
    if (user && !expoPushToken) {
      requestNotificationPermission();
    }
  }, [user, expoPushToken]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
      tabBar={(props) =>
        pathname === "/addSex" ? null : <TabBar {...props} />
      }
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "LoveMap",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => {
            const router = useRouter();
            return (
              <TouchableOpacity
                onPress={() =>
                  !user
                    ? router.push("/modals/auth")
                    : router.push("/modals/filters")
                }
                className="mr-4"
              >
                <MaterialCommunityIcons
                  name="tune-variant"
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tabs.Screen
        name="social"
        options={{
          title: "Actualités",
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          headerRight: () => {
            const router = useRouter();
            const { data: pendingRequests = [] } = useFriendRequests(user?.uid);

            return (
              <TouchableOpacity
                onPress={() =>
                  !user
                    ? router.push("/modals/auth")
                    : router.push("/modals/friendsList")
                }
                className="mr-4"
              >
                <View className="relative">
                  <MaterialCommunityIcons
                    name="account-multiple"
                    size={24}
                    color="#666"
                  />
                  {pendingRequests.length > 0 && (
                    <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                      <Text className="text-white text-xs font-bold">
                        {pendingRequests.length}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tabs.Screen
        name="success"
        options={{
          title: "Mes succès",
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Mon compte",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
