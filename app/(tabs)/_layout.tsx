import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import { usePathname } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { TabBar } from "@/components/navigation/TabBar";

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

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
      tabBar={(props) =>
        pathname === "/addSex" ? null : <TabBar {...props} />
      }
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Homepage",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
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
