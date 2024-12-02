import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
  onClose?: () => void;
  rightElement?: React.ReactNode;
}

export const Header = ({ title, onClose, rightElement }: HeaderProps) => {
  return (
    <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
      <Text className="text-lg font-semibold">{title}</Text>
      <View className="flex-row items-center gap-4">
        {rightElement}
        {onClose && (
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
