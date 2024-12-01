import { TextInput, TextInputProps, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  icon?: keyof typeof Feather.glyphMap;
  onIconPress?: () => void;
}

export const Input = ({ icon, onIconPress, ...props }: InputProps) => (
  <View className="relative">
    <TextInput
      className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 pr-12"
      placeholderTextColor="#9CA3AF"
      autoComplete="off"
      textContentType="none"
      autoCorrect={false}
      spellCheck={false}
      {...props}
    />
    {icon && (
      <TouchableOpacity
        className="absolute right-4 top-4"
        onPress={onIconPress}
      >
        <Feather name={icon} size={20} color="#666" />
      </TouchableOpacity>
    )}
  </View>
); 