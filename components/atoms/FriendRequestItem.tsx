import { TouchableOpacity, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface FriendRequestItemProps {
  displayName: string;
  onAccept: () => void;
  onReject: () => void;
}

export const FriendRequestItem = ({
  displayName,
  onAccept,
  onReject,
}: FriendRequestItemProps) => (
  <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 p-4 rounded-lg">
    <View className="flex-row items-center">
      <MaterialCommunityIcons name="account" size={24} color="#666" />
      <Text className="ml-3 font-medium">
        {displayName.length > 10
          ? `${displayName.slice(0, 10)}... `
          : displayName}{" "}
        vous a demandé en ami
      </Text>
    </View>
    <View className="flex-row">
      <TouchableOpacity onPress={onAccept} className="p-2">
        <MaterialCommunityIcons name="check-circle" size={20} color="green" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onReject} className="p-2">
        <MaterialCommunityIcons name="close-circle" size={20} color="red" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
); 