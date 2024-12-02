import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";
type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface EmptyStateProps {
  icon: IconName;
  message: string;
}

export const EmptyState = ({ icon, message }: EmptyStateProps) => (
  <View className="items-center py-8">
    <MaterialCommunityIcons name={icon} size={48} color="#9CA3AF" />
    <Text className="text-gray-500 text-center mt-4">{message}</Text>
  </View>
); 