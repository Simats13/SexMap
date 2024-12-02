import { TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface SelectButtonProps {
  onPress: () => void;
  title: string;
  icon?: keyof typeof Feather.glyphMap;
}

export const SelectButton = ({ onPress, title, icon = "chevron-right" }: SelectButtonProps) => (
  <TouchableOpacity 
    onPress={onPress}
    className="border border-gray-300 rounded-lg p-4 mb-6 flex-row justify-between items-center"
  >
    <Text className="text-black">{title}</Text>
    <Feather name={icon} size={20} color="#666" />
  </TouchableOpacity>
); 