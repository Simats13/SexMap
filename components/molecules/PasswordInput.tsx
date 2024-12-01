import { useState } from "react";
import { Input } from "../atoms/Input";

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const PasswordInput = ({
  value,
  onChangeText,
  placeholder = "Mot de passe"
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      placeholder={placeholder}
      secureTextEntry={!showPassword}
      value={value}
      onChangeText={onChangeText}
      icon={showPassword ? "eye-off" : "eye"}
      onIconPress={() => setShowPassword(!showPassword)}
    />
  );
}; 