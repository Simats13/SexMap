import { TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  className?: string;
}

export const Input = ({ className = "", ...props }: InputProps) => (
  <TextInput
    className={`border border-gray-300 rounded-lg p-4 text-gray-700 ${className}`}
    {...props}
  />
); 