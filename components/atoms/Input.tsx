import { TextInput, View, Text } from "react-native";
import { forwardRef } from "react";

interface InputProps extends React.ComponentProps<typeof TextInput> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <View className="mb-4">
        {label && (
          <Text className="text-gray-700 font-medium mb-1">{label}</Text>
        )}
        <TextInput
          ref={ref}
          className={`bg-gray-50 border rounded-lg px-4 py-3 text-gray-900 ${
            error ? "border-red-500" : "border-gray-200"
          } ${className}`}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          textContentType={props.keyboardType === "email-address" ? "emailAddress" : props.secureTextEntry ? "password" : "none"}
          autoComplete={props.keyboardType === "email-address" ? "email" : props.secureTextEntry ? "password" : "off"}
          {...props}
        />
        {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      </View>
    );
  }
);

Input.displayName = "Input"; 