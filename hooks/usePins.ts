import {
  collection,
  getDocs,
  GeoPoint,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useDeviceId } from "./useDeviceId";
import * as Location from "expo-location";

export type FilterType = "public" | "friends" | "private";

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface Pin {
  id: string;
  title?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  rating?: number;
  createdAt: Date;
  userId?: string;
  displayName?: string;
  visibility: "public" | "private" | "friends";
}

interface FirestoreDoc {
  id: string;
  title?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  rating?: number;
  createdAt: { toDate: () => Date };
  userId?: string;
  visibility: "public" | "private" | "friends";
  solo: boolean;
}

const RADIUS = 0.2;

export const usePins = (region?: MapRegion, filter: FilterType = "public") => {
  const [visiblePins, setVisiblePins] = useState<Pin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchRegion, setLastSearchRegion] = useState<MapRegion | null>(
    null
  );
  const { data: user } = useAuth();
  const { deviceId } = useDeviceId();

  const getCurrentRegion = useCallback(async (): Promise<MapRegion> => {
    if (region) return region;

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission de localisation refusée");
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }, [region]);

  // Mise à jour lors du changement de filtre si on a déjà une région de recherche
  useEffect(() => {
    const loadPins = async () => {
      try {
        // Si on a déjà fait une recherche dans une zone, on réutilise cette zone
        if (lastSearchRegion) {
          fetchPinsInArea(lastSearchRegion);
        } else {
          // Sinon, on obtient la position actuelle
          const currentRegion = await getCurrentRegion();
          fetchPinsInArea(currentRegion);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la position:", error);
      }
    };

    loadPins();
  }, [filter, getCurrentRegion, lastSearchRegion]);

  const fetchPinsInArea = useCallback(
    async (searchRegion: MapRegion) => {
      setIsLoading(true);
      try {
        setLastSearchRegion(searchRegion);

        const collectionRef = collection(db, "maps");
        let queryRef = query(
          collectionRef,
          where("visibility", "==", "public")
        );

        if (filter === "private") {
          if (user) {
            queryRef = query(queryRef, where("userId", "==", user.uid));
          } else {
            queryRef = query(queryRef, where("link", "==", deviceId));
          }
        } else if (filter === "friends") {
          if (!user) {
            console.error("User not found");
            return;
          }
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const friendsList = userDoc.data()?.friendsList || [];

          queryRef = query(
            queryRef,
            where("link", "in", friendsList),
            where("visibility", "in", ["public", "friends"])
          );
        }

        const querySnapshot = await getDocs(queryRef);
        const pins = querySnapshot.docs
          .map((doc) => {
            const data = doc.data() as FirestoreDoc;
            return {
              ...data,
              id: doc.id,
              createdAt: data.createdAt?.toDate() || new Date(),
            };
          })
          .filter((pin) => {
            const latDiff = Math.abs(
              pin.location.latitude - searchRegion.latitude
            );
            const lonDiff = Math.abs(
              pin.location.longitude - searchRegion.longitude
            );
            return latDiff <= RADIUS && lonDiff <= RADIUS;
          });

        setVisiblePins(pins);
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [filter, user, deviceId]
  );

  return {
    data: visiblePins,
    isLoading,
    searchInArea: (region: MapRegion) => fetchPinsInArea(region),
  };
};
