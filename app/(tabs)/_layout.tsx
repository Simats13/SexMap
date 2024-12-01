import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import { usePathname } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { TabBar } from "@/components/navigation/TabBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";

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
          title: "SexMap",
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
          title: "Social",
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        }}
      />

      <Tabs.Screen
        name="success"
        options={{
          title: "Success",
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
