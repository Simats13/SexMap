import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";

interface ErrorSnackbarProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  type?: "error" | "success";
  keyboardVisible?: boolean;
}

export const ErrorSnackbar = ({
  message,
  visible,
  onDismiss,
  type = "error",
  keyboardVisible = false,
}: ErrorSnackbarProps) => {
  const insets = useSafeAreaInsets();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        {
          opacity,
          position: 'absolute',
          bottom: keyboardVisible ? 320 : insets.bottom + 16,
          left: 16,
          right: 16,
        },
      ]}
    >
      <View className={`p-4 rounded-lg ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
        <Text className="text-white text-center">{message}</Text>
      </View>
    </Animated.View>
  );
}; 