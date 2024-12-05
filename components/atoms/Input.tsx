import { TextInput, View, Text, TouchableOpacity } from "react-native";
import { forwardRef } from "react";
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends React.ComponentProps<typeof TextInput> {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className = "", icon, onIconPress, ...props }, ref) => {
    return (
      <View className="mb-4">
        {label && (
          <Text className="text-gray-700 font-medium mb-1">{label}</Text>
        )}
        <View className="relative">
          <TextInput
            ref={ref}
            className={`bg-gray-50 border rounded-lg px-4 py-3 text-gray-900 ${
              error ? "border-red-500" : "border-gray-200"
            } ${icon ? "pr-12" : ""} ${className}`}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            textContentType={props.keyboardType === "email-address" ? "emailAddress" : props.secureTextEntry ? "password" : "none"}
            autoComplete={props.keyboardType === "email-address" ? "email" : props.secureTextEntry ? "password" : "off"}
            {...props}
          />
          {icon && (
            <TouchableOpacity 
              onPress={onIconPress}
              className="absolute right-4 top-0 bottom-0 justify-center"
            >
              <Ionicons name={icon} size={24} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      </View>
    );
  }
);

Input.displayName = "Input"; 