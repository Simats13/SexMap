import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

interface EulaCheckboxProps {
  checked: boolean;
  onCheck: (checked: boolean) => void;
}

export const EulaCheckbox = ({ checked, onCheck }: EulaCheckboxProps) => {
  const openTerms = async () => {
    await WebBrowser.openBrowserAsync("https://lovemap.simats.dev/terms");
  };

  return (
    <View className="mb-4">
      <Pressable
        onPress={() => onCheck(!checked)}
        className="flex-row items-center"
      >
        <View
          className={`w-6 h-6 border rounded-md mr-2 items-center justify-center ${
            checked ? "bg-red-500 border-red-500" : "border-gray-300"
          }`}
        >
          {checked && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
        <Text className="flex-1 text-sm text-gray-600">
          J'accepte les{" "}
          <Text className="text-red-500 underline" onPress={openTerms}>
            conditions générales d'utilisation
          </Text>
        </Text>
      </Pressable>
    </View>
  );
};
