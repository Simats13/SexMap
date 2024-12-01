import { View, Platform } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface LocationPickerProps {
  onLocationChange?: (location: { latitude: number; longitude: number }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  readonly?: boolean;
}

export const LocationPicker = ({ 
  onLocationChange, 
  initialLocation,
  readonly = false 
}: LocationPickerProps) => {
  const [location, setLocation] = useState<Region>({
    latitude: 48.866667,
    longitude: 2.333333,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  const updateLocation = (coords: { latitude: number; longitude: number }) => {
    onLocationChange?.({ 
      latitude: coords.latitude,
      longitude: coords.longitude 
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          ...location,
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
        updateLocation(currentLocation.coords);
      }
    })();
  }, []);

  return (
    <View className="w-full h-[150px] rounded-lg overflow-hidden">
      <MapView
        className="w-full h-full"
        region={location}
        scrollEnabled={!readonly}
        zoomEnabled={!readonly}
        zoomControlEnabled={true}
        onRegionChangeComplete={(region) => {
          setLocation(region);
          updateLocation(region);
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          draggable
          onDragEnd={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setLocation({
              ...location,
              latitude,
              longitude,
            });
            updateLocation({ latitude, longitude });
          }}
        />
      </MapView>
    </View>
  );
};
