import { View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface RatingBarProps {
  rating: number;
  size?: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingBar = ({
  rating,
  size = 35,
  readonly = false,
  onRatingChange
}: RatingBarProps) => {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange && onRatingChange(star)}
          className="mr-1"
          disabled={readonly}
        >
          <FontAwesome
            name={star <= rating ? "star" : "star-o"}
            size={size}
            color={star <= rating ? "#FFD700" : "#D3D3D3"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}; 