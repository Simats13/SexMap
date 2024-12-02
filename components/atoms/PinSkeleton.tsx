import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";
import { useEffect } from "react";

export const PinSkeleton = () => {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.5, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[animatedStyle]} 
      className="flex-row items-center p-4 bg-white mb-2 rounded-lg shadow-sm"
    >
      <View className="flex-1">
        <View className="h-5 w-32 bg-gray-200 rounded mb-2" />
        <View className="flex-row items-center">
          <View className="h-4 w-4 bg-gray-200 rounded mr-2" />
          <View className="h-4 w-24 bg-gray-200 rounded" />
        </View>
        <View className="mt-2 flex-row">
          {[...Array(5)].map((_, i) => (
            <View key={i} className="h-4 w-4 bg-gray-200 rounded mr-1" />
          ))}
        </View>
      </View>
      <View className="flex-row items-center">
        <View className="h-5 w-5 bg-gray-200 rounded mr-2" />
        <View className="h-6 w-6 bg-gray-200 rounded" />
      </View>
    </Animated.View>
  );
}; 