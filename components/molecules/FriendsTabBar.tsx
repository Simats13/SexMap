import { View, TouchableOpacity, Text } from "react-native";

interface FriendsTabBarProps {
  activeTab: "added" | "pending";
  onTabChange: (tab: "added" | "pending") => void;
}

export const FriendsTabBar = ({ activeTab, onTabChange }: FriendsTabBarProps) => (
  <View className="flex-row border-b border-gray-200">
    <TouchableOpacity
      className={`flex-1 py-3 ${
        activeTab === "added" ? "border-b-2 border-red-500" : ""
      }`}
      onPress={() => onTabChange("added")}
    >
      <Text
        className={`text-center font-medium ${
          activeTab === "added" ? "text-red-500" : "text-gray-600"
        }`}
      >
        Ajoutés
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      className={`flex-1 py-3 ${
        activeTab === "pending" ? "border-b-2 border-red-500" : ""
      }`}
      onPress={() => onTabChange("pending")}
    >
      <Text
        className={`text-center font-medium ${
          activeTab === "pending" ? "text-red-500" : "text-gray-600"
        }`}
      >
        En attente
      </Text>
    </TouchableOpacity>
  </View>
); 