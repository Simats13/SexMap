import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Header } from "../organisms/Header";
import { LocationPicker } from "../molecules/LocationPicker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface ShowSexTemplateProps {
  pin: {
    id: string;
    title: string;
    location: {
      latitude: number;
      longitude: number;
    };
    createdAt: Date;
    userId: string;
    description?: string;
    partner?: string;
    rating?: number;
  };
}

export const ShowSexTemplate = ({ pin }: ShowSexTemplateProps) => {
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const getAddress = async () => {
      try {
        const results = await Location.reverseGeocodeAsync({
          latitude: pin.location.latitude,
          longitude: pin.location.longitude,
        });

        if (results[0]) {
          const { street, name, city, region, country } = results[0];
          const fullAddress = [street || name, city, region, country]
            .filter(Boolean)
            .join(", ");
          setAddress(fullAddress);
        }
      } catch (error) {
        console.error("Erreur de géocodage:", error);
      }
    };

    getAddress();
  }, [pin.location]);

  return (
    <View className="flex-1 bg-white">
      <Header title="Détails du SexPin" />
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="mb-8 bg-white rounded-xl shadow-md p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              📍 Localisation
            </Text>
            {address && (
              <Text className="text-gray-600 mb-2">{address}</Text>
            )}
            <LocationPicker initialLocation={pin.location} readonly />
          </View>

          <View className="mb-8 bg-white rounded-xl shadow-md p-4">
            <View className="flex-row items-center mb-2">
              <Feather name="calendar" size={20} color="#4B5563" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Date et heure
              </Text>
            </View>
            <Text className="text-gray-600 text-base">
              {format(pin.createdAt, "PPPp", { locale: fr })}
            </Text>
          </View>

          {pin.partner && (
            <View className="mb-8 bg-white rounded-xl shadow-md p-4">
              <View className="flex-row items-center mb-2">
                <Feather name="users" size={20} color="#4B5563" />
                <Text className="text-lg font-semibold text-gray-800 ml-2">
                  Partenaire
                </Text>
              </View>
              <Text className="text-gray-600 text-base">{pin.partner}</Text>
            </View>
          )}

          {pin.description && (
            <View className="mb-8 bg-white rounded-xl shadow-md p-4">
              <View className="flex-row items-center mb-2">
                <Feather name="file-text" size={20} color="#4B5563" />
                <Text className="text-lg font-semibold text-gray-800 ml-2">
                  Description
                </Text>
              </View>
              <Text className="text-gray-600 text-base leading-relaxed">
                {pin.description}
              </Text>
            </View>
          )}

          {pin.rating && (
            <View className="mb-8 bg-white rounded-xl shadow-md p-4">
              <View className="flex-row items-center mb-2">
                <Feather name="star" size={20} color="#4B5563" />
                <Text className="text-lg font-semibold text-gray-800 ml-2">
                  Note
                </Text>
              </View>
              <View className="flex-row">
                {[...Array(5)].map((_, i) => (
                  <Text
                    key={i}
                    className={
                      i < (pin.rating ?? 0)
                        ? "text-yellow-500 text-2xl"
                        : "text-gray-300 text-2xl"
                    }
                  >
                    ★
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};