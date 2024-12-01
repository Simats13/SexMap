import { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SnackbarProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  type?: 'error' | 'success';
}

export const Snackbar = ({ message, visible, onDismiss, type = 'error' }: SnackbarProps) => {
  const insets = useSafeAreaInsets();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onDismiss());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity,
        position: 'absolute',
        bottom: insets.bottom + 16,
        left: 16,
        right: 16,
      }}
    >
      <View
        className={`p-4 rounded-lg shadow-lg ${
          type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}
      >
        <Text className="text-white text-center font-medium">{message}</Text>
      </View>
    </Animated.View>
  );
}; 