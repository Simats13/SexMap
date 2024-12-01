import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export const Header = ({ title }: { title: string }) => {
  const router = useRouter();
  
  return (
    <View className="bg-red-600 p-4">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl ml-4">{title}</Text>
      </View>
    </View>
  );
}; 