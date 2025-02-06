import { View, Text } from "react-native";
import Animated, {
  FadeIn,
  withSpring,
  useAnimatedStyle,
  withSequence,
  withDelay,
} from "react-native-reanimated";

export default function CustomSplash() {
  const emojis = [
    "📍",
    "🗺️",
    "❤️",
    "🔥",
    "✨",
  ] as const;
  type Emoji = (typeof emojis)[number];

  const colors: Record<Emoji, string> = {
    "📍": "bg-rose-500",
    "🗺️": "bg-rose-500",
    "🔥": "bg-rose-500",
    "❤️": "bg-rose-500",
    "✨": "bg-rose-500",
  };

  const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const backgroundColor = colors[selectedEmoji];

  const titleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSequence(
          withSpring(1.1, { damping: 12 }),
          withSpring(1, { damping: 12 })
        ),
      },
    ],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withDelay(
          400,
          withSpring(1, {
            damping: 12,
            stiffness: 100,
            mass: 0.8,
          })
        ),
      },
    ],
    opacity: withDelay(400, withSpring(1)),
  }));

  return (
    <View className={`flex-1 ${backgroundColor} items-center justify-center`}>
      <Animated.Text
        entering={FadeIn.duration(800)}
        style={titleStyle}
        className="text-white text-6xl font-bold mb-8"
      >
        LoveMap
      </Animated.Text>

      <Animated.View
        className="items-center"
        style={[{ opacity: 0 }, iconStyle]}
      >
        <Text className="text-5xl">{selectedEmoji}</Text>
      </Animated.View>
    </View>
  );
}
