import { TouchableOpacity, View, Text } from "react-native";

interface FriendRequestItemProps {
  displayName: string;
  onAccept?: () => void;
  onReject?: () => void;
  isPending?: boolean;
  onCancel?: () => void;
}

export const FriendRequestItem = ({
  displayName,
  onAccept,
  onReject,
  isPending,
  onCancel,
}: FriendRequestItemProps) => (
  <View className="flex-row items-center justify-between p-4 bg-white rounded-lg">
    <Text className="text-gray-800 font-medium">{displayName}</Text>
    <View className="flex-row space-x-2">
      {!isPending && onAccept && (
        <TouchableOpacity
          onPress={onAccept}
          className="bg-red-500 px-3 py-1 rounded-lg"
        >
          <Text className="text-white">Accepter</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={isPending ? onCancel : onReject}
        className="bg-gray-200 px-3 py-1 rounded-lg"
      >
        <Text className="text-gray-700">
          {isPending ? "Annuler" : "Refuser"}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);
