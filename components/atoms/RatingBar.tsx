import { View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface RatingBarProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export const RatingBar = ({
  rating,
  onRatingChange,
  size = 35,
  activeColor = "#FFD700",
  inactiveColor = "#D3D3D3"
}: RatingBarProps) => {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          className="mr-1"
        >
          <FontAwesome
            name={star <= rating ? "star" : "star-o"}
            size={size}
            color={star <= rating ? activeColor : inactiveColor}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}; 