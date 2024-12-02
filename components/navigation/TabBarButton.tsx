import React, { useRef, useEffect } from "react";
import { TouchableOpacity, View, Animated, Text } from "react-native";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@/hooks/useAuth";
import { useFriendRequests } from "@/hooks/useFriendRequests";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];
type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome6>["name"];

const getIconName = (
  routeName: string
): FeatherIconName | FontAwesomeIconName => {
  switch (routeName) {
    case "index":
      return "home";
    case "success":
      return "trophy";
    case "profile":
      return "user";
    case "social":
      return "users";
    default:
      return "circle";
  }
};

interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  label: string;
  primaryColor: string;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
  primaryColor,
}) => {
  const clickAnim = useRef(new Animated.Value(1)).current;
  const focusAnim = useRef(new Animated.Value(isFocused ? 1.1 : 1)).current;
  const { data: user } = useAuth();
  const { data: pendingRequests = [] } = useFriendRequests(user?.uid);
  const showBadge = routeName === "social" && pendingRequests.length > 0;

  useEffect(() => {
    Animated.spring(focusAnim, {
      toValue: isFocused ? 1.1 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [isFocused]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(clickAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(clickAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const scaleValue = Animated.multiply(clickAnim, focusAnim);

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      className="flex-1 justify-center items-center min-w-12 min-h-12 z-10"
    >
      <View className="relative">
        <Animated.View
          style={{ transform: [{ scale: scaleValue }] }}
          className="items-center"
        >
          {routeName === "success" ? (
            <FontAwesome6
              name={getIconName(routeName)}
              size={24}
              color={isFocused ? primaryColor : "gray"}
            />
          ) : (
            <Feather
              name={getIconName(routeName)}
              size={24}
              color={isFocused ? primaryColor : "gray"}
            />
          )}
        </Animated.View>
        {showBadge && (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TabBarButton;
