import { Text, View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useEffect, useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { usePins, MapRegion } from "@/hooks/usePins";
import { useRouter } from "expo-router";

interface Pin {
  id: string;
  title: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function Index() {
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const [mapRegion, setMapRegion] = useState<MapRegion>();
  const { data: pins, isLoading: pinsLoading } = usePins(mapRegion);
  const router = useRouter();

  console.log(pins);
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
    setMapRegion(region);
  };

  if (isLoading || !userLocation || pinsLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Chargement de la carte...</Text>
      </View>
    );
  }

  console.log(pins);

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
          />
        ))}
      </MapView>

      <TouchableOpacity
        onPress={centerToLocation}
        className="absolute bottom-24 right-4 bg-white p-3 rounded-full shadow-lg"
      >
        <Feather name="crosshair" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
}
