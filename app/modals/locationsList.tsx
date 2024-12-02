import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  useFavoriteLocations,
  useAddFavoriteLocation,
  useDeleteFavoriteLocation,
} from "@/hooks/useFavoriteLocations";
import { Input } from "@/components/atoms/Input";
import { Header } from "@/components/organisms/Header";
import { EmptyState } from "@/components/molecules/EmptyState";

export default function LocationsList() {
  const router = useRouter();
  const { data: user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [locationName, setLocationName] = useState("");

  const { data: favoriteLocations = [] } = useFavoriteLocations(user?.uid);
  const { mutate: addLocation } = useAddFavoriteLocation();
  const { mutate: deleteLocation } = useDeleteFavoriteLocation();

  const handleAddLocation = () => {
    if (!user?.uid) return;
    addLocation({ userId: user.uid, name: locationName });
    setShowAddModal(false);
    setLocationName("");
  };

  return (
    <View className="flex-1 bg-white">
      <Header
        title="Lieux favoris"
        onClose={() => router.back()}
        rightElement={
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={24} color="#666" />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1 p-4">
        {favoriteLocations.length === 0 ? (
          <EmptyState
            icon="map-marker"
            message="Vous n'avez pas encore de lieux favoris. Ajoutez des lieux pour les retrouver facilement !"
          />
        ) : (
          <View className="space-y-2">
            {favoriteLocations.map((location) => (
              <View
                key={location.id}
                className="flex-row justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
              >
                <View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {location.name}
                  </Text>
                  {location.address && (
                    <Text className="text-gray-600">{location.address}</Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => deleteLocation(location.id)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-w-sm rounded-lg p-4">
            <Text className="text-xl font-bold mb-4">
              Ajouter un lieu favori
            </Text>
            <Input
              placeholder="Nom du lieu"
              value={locationName}
              onChangeText={setLocationName}
              autoCapitalize="none"
            />
            <View className="flex-row justify-end space-x-2 mt-4">
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                <Text className="text-gray-700">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddLocation}
                className="px-4 py-2 rounded-lg bg-red-500"
              >
                <Text className="text-white">Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
