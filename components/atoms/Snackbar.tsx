import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";

interface SnackbarProps {
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  duration?: number;
  onDismiss?: () => void;
}

const renderMessage = (message: string) => {
  const parts = message.split(/(\*[^*]+\*)/g);
  return (
    <Text className="text-white flex-1 mr-4">
      {parts.map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <Text key={index} style={{ fontStyle: 'italic' }}>
              {part.slice(1, -1)}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

export const Snackbar = ({
  message,
  action,
  duration = 4000,
  onDismiss,
}: SnackbarProps) => {
  const [visible, setVisible] = useState(true);
  const translateY = new Animated.Value(100);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      hide();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hide = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onDismiss?.();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 bg-gray-800 mx-4 mb-4 rounded-lg shadow-lg"
      style={{ transform: [{ translateY }] }}
    >
      <View className="flex-row items-center justify-between p-4">
        {renderMessage(message)}
        {action && (
          <TouchableOpacity
            onPress={() => {
              action.onPress();
              hide();
            }}
          >
            <Text className="text-red-500 font-medium uppercase">
              {action.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}; 