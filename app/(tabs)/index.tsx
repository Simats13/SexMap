import { Text, View, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useEffect, useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { usePins, MapRegion, FilterType } from "@/hooks/usePins";
import { useRouter } from "expo-router";
import { useFilter } from "@/contexts/FilterContext";

interface Pin {
  id: string;
  title: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function Index() {
  const { filter } = useFilter();
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const [mapRegion, setMapRegion] = useState<MapRegion>();
  const {
    data: pins,
    isLoading: pinsLoading,
    searchInArea,
  } = usePins(
    mapRegion,
    filter
  );
  const router = useRouter();
  const [isMapMoved, setIsMapMoved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission refusée");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLocation(currentLocation);
      } catch (error) {
        console.error("Erreur de localisation:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const centerToLocation = () => {
    if (!userLocation || !mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const handleRegionChange = (region: MapRegion) => {
    setIsMapMoved(true);
    setMapRegion(region);
  };

  const handleSearchInArea = () => {
    setIsMapMoved(false);
    if (mapRegion) {
      searchInArea(mapRegion);
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    if (mapRegion) {
      searchInArea(mapRegion);
    }
  };

  useEffect(() => {
    if (mapRegion) {
      searchInArea(mapRegion);
    }
  }, [filter]);

  if (isLoading || !userLocation) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        className="w-full h-full"
        zoomEnabled={true}
        zoomControlEnabled={true}
        showsUserLocation
        initialRegion={{
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onRegionChangeComplete={handleRegionChange}
      >
        {pins?.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.location.latitude,
              longitude: pin.location.longitude,
            }}
            title={pin.title}
            onPress={() => router.push(`/modals/showSex?id=${pin.id}`)}
            pinColor="#FF69B4"
          />
        ))}
      </MapView>

      <TouchableOpacity
        onPress={centerToLocation}
        className="absolute bottom-24 right-4 bg-white p-3 rounded-full shadow-lg"
      >
        <Feather name="crosshair" size={24} color="#666" />
      </TouchableOpacity>

      {isMapMoved && (
        <TouchableOpacity
          onPress={handleSearchInArea}
          className="absolute top-4 left-4 right-4 bg-red-500 p-3 rounded-lg shadow-lg"
        >
          <Text className="text-white text-center font-medium">
            Rechercher dans cette zone
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
