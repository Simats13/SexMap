import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  onClose?: () => void;
}

export const Header = ({ title, onClose }: HeaderProps) => {
  const router = useRouter();
  
  return (
    <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
      <Text className="text-lg font-semibold">{title}</Text>
      {onClose && (
        <TouchableOpacity onPress={onClose}>
          <Feather name="x" size={24} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
}; 