import { View, Platform } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface LocationPickerProps {
  onLocationChange: (location: { latitude: number; longitude: number }) => void;
}

export const LocationPicker = ({ onLocationChange }: LocationPickerProps) => {
  const [location, setLocation] = useState<Region>({
    latitude: 48.866667,
    longitude: 2.333333,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

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
        onLocationChange({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    })();
  }, []);

  return (
    <View className="w-full h-[150px] rounded-lg overflow-hidden">
      <MapView
        className="w-full h-full"
        region={location}
        zoomEnabled={true}
        zoomControlEnabled={true}
        onRegionChangeComplete={(region) => {
          setLocation(region);
          onLocationChange({
            latitude: region.latitude,
            longitude: region.longitude,
          });
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
            onLocationChange({ latitude, longitude });
          }}
        />
      </MapView>
    </View>
  );
};
