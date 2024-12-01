import { useEffect } from 'react';
import { View, Text, Animated, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SnackbarProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  type?: 'error' | 'success';
  keyboardVisible?: boolean;
}

export const Snackbar = ({ 
  message, 
  visible, 
  onDismiss, 
  type = 'error',
  keyboardVisible = false,
}: SnackbarProps) => {
  const insets = useSafeAreaInsets();
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(100);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 100,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => onDismiss());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        position: 'absolute',
        bottom: keyboardVisible ? (Platform.OS === 'ios' ? 320 : 0) : insets.bottom + 16,
        left: 16,
        right: 16,
        zIndex: 1000,
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