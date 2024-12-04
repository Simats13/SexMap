import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { RatingBar } from "@/components/atoms/RatingBar";

interface Pin {
  id: string;
  title?: string;
  date: string | number | Date;
  location: {
    latitude: number;
    longitude: number;
  };
  locationName?: string;
  rating?: number;
  visibility: "public" | "private" | "friends";
  name?: string;
}

interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

export default function GroupedPinsModal() {
  const router = useRouter();
  const { pins } = useLocalSearchParams();
  const pinsList = JSON.parse(pins as string) as Pin[];

  const formatDate = (date: string | number | Date | FirebaseTimestamp) => {
    try {
      let dateObj: Date;
      
      if (typeof date === 'object' && 'seconds' in date) {
        // Conversion du timestamp Firebase
        dateObj = new Date(date.seconds * 1000);
      } else {
        dateObj = new Date(date);
      }

      if (isNaN(dateObj.getTime())) {
        return "Date inconnue";
      }
      return format(dateObj, "dd MMMM yyyy", { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return "Date inconnue";
    }
  };

  const renderItem = ({ item }: { item: Pin }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 bg-white mb-2 rounded-lg shadow-sm"
      onPress={() => router.push(`/modals/showSex?id=${item.id}`)}
    >
      <View className="flex-1">
        {item.name && (
          <Text className="text-gray-800 font-medium mb-1">{item.name}</Text>
        )}
        <Text className="text-gray-800 font-medium mb-1">
          {formatDate(item.date)}
        </Text>
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="map-marker"
            size={16}
            color="#666"
            style={{ marginRight: 4 }}
          />
          <Text className="text-gray-600">
            {item.locationName || "Sans lieu"}
          </Text>
        </View>
        {item.rating && (
          <View className="mt-1">
            <RatingBar rating={item.rating} size={16} />
          </View>
        )}
      </View>
      <View className="flex-row items-center">
        <MaterialCommunityIcons
          name={
            item.visibility === "private"
              ? "lock"
              : item.visibility === "friends"
              ? "account-group"
              : "earth"
          }
          size={20}
          color="#666"
          style={{ marginRight: 8 }}
        />
        <Feather name="chevron-right" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-center">
          Pins à cet endroit
        </Text>
      </View>

      <FlatList
        data={pinsList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
