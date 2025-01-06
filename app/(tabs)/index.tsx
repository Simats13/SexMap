import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useEffect, useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { usePins, MapRegion, FilterType } from "@/hooks/usePins";
import { useRouter } from "expo-router";
import { useFilter } from "@/contexts/FilterContext";
import { MotiView } from "moti";

interface Pin {
  id: string;
  title?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface GroupedPin {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  pins: Pin[];
}

interface AnimatedMarkerProps {
  group: GroupedPin;
  onPress: () => void;
}

const LocationDisabledView = () => (
  <ScrollView className="flex-1 bg-gray-50">
    <View className="flex-1 bg-gray-50 p-6">
      <View className="bg-white rounded-2xl p-6 shadow-md">
        <View className="items-center mb-6">
          <View className="bg-red-100 w-20 h-20 rounded-full items-center justify-center mb-4">
            <Feather name="map-pin" size={40} color="#FF1744" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
            Localisation désactivée
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            Active ta position pour découvrir les LovePins près de chez toi et
            partager tes expériences
          </Text>
        </View>

        {/* Aperçu de la carte */}
        <View className="mb-6">
          <View className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden opacity-50">
            <View className="absolute inset-0 items-center justify-center">
              <Feather name="map" size={48} color="#666" />
            </View>
          </View>

          {/* Exemples de pins */}
          <View className="opacity-50">
            <View className="flex-row items-center p-4 bg-gray-50 mb-2 rounded-lg">
              <View className="flex-1">
                <Text className="text-gray-800 font-medium mb-1">
                  LovePin à proximité
                </Text>
                <View className="flex-row items-center">
                  <Feather
                    name="map-pin"
                    size={16}
                    color="#666"
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-gray-600">500m de chez toi</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="opacity-30">
            <View className="flex-row items-center p-4 bg-gray-50 rounded-lg">
              <View className="flex-1">
                <Text className="text-gray-800 font-medium mb-1">
                  Lieu secret
                </Text>
                <View className="flex-row items-center">
                  <Feather
                    name="map-pin"
                    size={16}
                    color="#666"
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-gray-600">1km de chez toi</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => Linking.openSettings()}
          className="bg-red-500 py-3 px-6 rounded-full"
        >
          <Text className="text-white font-bold text-center">
            Activer la localisation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
);

// Ajoutez cette fonction pour calculer la précision en fonction du zoom
const getClusterPrecision = (region: MapRegion) => {
  const { latitudeDelta } = region;
  if (latitudeDelta > 0.5) return 1; // Très zoomé out
  if (latitudeDelta > 0.1) return 2;
  if (latitudeDelta > 0.05) return 3;
  if (latitudeDelta > 0.01) return 4;
  return 5; // Très zoomé in
};

// Dans le composant Index, ajoutez cette fonction pour l'animation
const AnimatedMarker = ({ group, onPress }: AnimatedMarkerProps) => {
  const animatedValue = new Animated.Value(0);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => onPress());
  };

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.8],
        }),
      },
    ],
  };

  return (
    <Marker coordinate={group.coordinate} onPress={handlePress}>
      <Animated.View style={animatedStyle} className="relative">
        <View className="bg-red-50 rounded-full p-3">
          <Feather name="map-pin" size={24} color="#FF1744" />
        </View>
        {group.pins.length > 1 && (
          <View className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 justify-center items-center border border-red-500">
            <Text className="text-red-500 text-xs font-bold">
              {group.pins.length}
            </Text>
          </View>
        )}
      </Animated.View>
    </Marker>
  );
};

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
  } = usePins(mapRegion, filter);
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

  // Modifiez la fonction de regroupement
  const groupPinsByLocation = (
    pins: Pin[],
    region: MapRegion
  ): GroupedPin[] => {
    const groups: Record<string, Pin[]> = {};
    const precision = getClusterPrecision(region);

    pins?.forEach((pin) => {
      const key = `${pin.location.latitude.toFixed(
        precision
      )},${pin.location.longitude.toFixed(precision)}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(pin);
    });

    return Object.entries(groups).map(([key, groupPins]) => ({
      coordinate: {
        latitude: parseFloat(key.split(",")[0]),
        longitude: parseFloat(key.split(",")[1]),
      },
      pins: groupPins,
    }));
  };

  if (isLoading) {
    return (
      <View className="flex-1">
        <MotiView
          className="w-full h-full bg-gray-200"
          from={{
            opacity: 0.5,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
          }}
        />

        <View className="absolute top-4 left-4 right-4">
          <MotiView
            className="w-full h-[46px] bg-gray-200 rounded-lg"
            from={{
              opacity: 0.5,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              type: "timing",
              duration: 1000,
              loop: true,
            }}
          />
        </View>

        <View className="absolute bottom-24 right-4">
          <MotiView
            className="w-[50px] h-[50px] bg-gray-200 rounded-full"
            from={{
              opacity: 0.5,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              type: "timing",
              duration: 1000,
              loop: true,
            }}
          />
        </View>
      </View>
    );
  }

  if (!userLocation) {
    return <LocationDisabledView />;
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
        {mapRegion &&
          groupPinsByLocation(pins, mapRegion).map((group, index) => (
            <AnimatedMarker
              key={index}
              group={group}
              onPress={() => {
                if (group.pins.length > 1) {
                  router.push({
                    pathname: "/modals/groupedPins",
                    params: { pins: JSON.stringify(group.pins) },
                  });
                } else {
                  router.push(`/modals/showSex?id=${group.pins[0].id}`);
                }
              }}
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
