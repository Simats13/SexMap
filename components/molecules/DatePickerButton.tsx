import { TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface DatePickerButtonProps {
  onPress: () => void;
  value: string;
  placeholder: string;
}

export const DatePickerButton = ({ onPress, value, placeholder }: DatePickerButtonProps) => (
  <TouchableOpacity 
    onPress={onPress}
    className="border border-gray-300 rounded-lg p-4 mb-6 flex-row justify-between items-center"
  >
    <Text className="text-gray-500">
      {value || placeholder}
    </Text>
    <Feather name="calendar" size={20} color="#666" />
  </TouchableOpacity>
); 