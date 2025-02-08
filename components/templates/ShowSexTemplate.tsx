import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Header } from "../organisms/Header";
import { LocationPicker } from "../molecules/LocationPicker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";

interface ShowSexTemplateProps {
  pin: {
    id: string;
    location: {
      latitude: number;
      longitude: number;
    };
    date: Date;
    link: string;
    rating: number;
    solo: boolean;
    likes: string[];
    name?: string;
    description?: string;
    partners?: string[];
    locationName?: string;
  };
  onShare: () => void;
  onLike: () => void;
  user?: User;
}

export const ShowSexTemplate = ({
  pin,
  onShare,
  onLike,
  user,
}: ShowSexTemplateProps) => {
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  const isLiked = user && pin.likes ? pin.likes.includes(user.uid) : false;

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
      <Header
        title="Détails du LovePin"
        onClose={() => router.back()}
        rightElement={
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-2" onPress={onShare}>
              <Feather name="share" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onLike}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "#EF4444" : "#666"}
              />
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="mb-8 bg-white rounded-xl shadow-md p-4">
            <View className="flex-row items-center mb-2">
              {pin.name && (
                <Text className="text-sm font-semibold text-gray-800 mb-3">
                  A été commis par {pin.name}{" "}
                  {pin.locationName ? `à ${pin.locationName}` : ""}
                </Text>
              )}
            </View>
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              📍 Localisation
            </Text>
            {address && <Text className="text-gray-600 mb-2">{address}</Text>}
            <LocationPicker initialLocation={pin.location} readonly />
            {pin.solo ? (
              <View className="flex-row items-center mb-2 mt-4">
                <Text className="text-gray-600">✊</Text>
                <Text className="text-gray-600 ml-2">Seul, c'est mieux !</Text>
              </View>
            ) : (
              <View className="flex-row items-center mb-2 mt-4">
                <Text className="text-gray-600">👫</Text>
                <Text className="text-gray-600 ml-2">
                  Plusieurs, c'est mieux !
                </Text>
              </View>
            )}
            <View className="flex-row items-center mb-2 mt-4">
              <Feather name="calendar" size={20} color="#4B5563" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Date et heure
              </Text>
            </View>
            <Text className="text-gray-600 text-base">
              {format(pin.date, "PPPp", { locale: fr })}
            </Text>
            {!pin.solo && pin.partners && pin.partners.length > 0 && (
              <>
                <View className="flex-row items-center mb-2 mt-4">
                  <Feather name="users" size={20} color="#4B5563" />
                  <Text className="text-lg font-semibold text-gray-800 ml-2">
                    Partenaire
                  </Text>
                </View>
                <View className="flex-row flex-wrap">
                  {pin.partners.map((partner, index) => (
                    <View
                      key={index}
                      className="bg-red-100 rounded-full px-3 py-1 m-1 self-start"
                    >
                      <Text className="text-red-600 text-base">{partner}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
            {pin.description && (
              <>
                <View className="flex-row items-center mb-2 mt-4">
                  <Feather name="file-text" size={20} color="#4B5563" />
                  <Text className="text-lg font-semibold text-gray-800 ml-2">
                    Description
                  </Text>
                </View>
                <Text className="text-gray-600 text-base leading-relaxed">
                  {pin.description}
                </Text>
              </>
            )}

            {pin.rating && (
              <>
                <View className="flex-row items-center mb-2 mt-4">
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
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
