import { TouchableOpacity, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface FriendItemProps {
  displayName: string;
  onRemove: () => void;
}

export const FriendItem = ({ displayName, onRemove }: FriendItemProps) => (
  <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 p-4 rounded-lg">
    <View className="flex-row items-center">
      <MaterialCommunityIcons name="account" size={24} color="#666" />
      <Text className="ml-3 font-medium">{displayName}</Text>
    </View>
    <TouchableOpacity onPress={onRemove} className="p-2">
      <MaterialCommunityIcons name="trash-can" size={20} color="red" />
    </TouchableOpacity>
  </TouchableOpacity>
); 