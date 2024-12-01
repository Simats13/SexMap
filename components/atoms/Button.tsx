import { TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  variant?: "primary" | "secondary" | "text";
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({ onPress, title, icon, variant = "primary", className = "", loading = false, disabled = false }: ButtonProps) => (
  <TouchableOpacity 
    onPress={onPress}
    disabled={disabled}
    className={`flex-row items-center justify-center rounded-full py-4 px-6 
      ${variant === "primary" ? "bg-red-500" : "border border-gray-300"}
      ${disabled ? "opacity-50" : ""}
      ${className}`}
  >
    {icon && <Feather name={icon} size={20} color={variant === "primary" ? "white" : "#666"} className="mr-2" />}
    <Text className={`font-semibold text-lg ${variant === "primary" ? "text-white" : "text-gray-500"}`}>
      {title}
    </Text>
  </TouchableOpacity>
); 