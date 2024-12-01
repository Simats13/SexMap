import { TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ButtonProps {
  onPress: () => void;
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  variant?: "primary" | "secondary";
  className?: string;
}

export const Button = ({ onPress, title, icon, variant = "primary", className = "" }: ButtonProps) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`flex-row items-center justify-center rounded-full py-4 px-6 
      ${variant === "primary" ? "bg-red-500" : "border border-gray-300"}
      ${className}`}
  >
    {icon && <Feather name={icon} size={20} color={variant === "primary" ? "white" : "#666"} className="mr-2" />}
    <Text className={`font-semibold text-lg ${variant === "primary" ? "text-white" : "text-gray-500"}`}>
      {title}
    </Text>
  </TouchableOpacity>
); 