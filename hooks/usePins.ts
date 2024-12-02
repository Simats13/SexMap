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
import { useQueryClient } from "@tanstack/react-query";
import { useDeviceId } from "./useDeviceId";

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
  const { data: user } = useAuth();
  const { deviceId } = useDeviceId();

  // Chargement initial des pins publics
  useEffect(() => {
    if (region) {
      fetchPinsInArea(region);
    }
  }, []); // S'exécute une seule fois au démarrage

  const fetchPinsInArea = useCallback(
    async (searchRegion: MapRegion) => {
      setIsLoading(true);
      try {
        const collectionRef = collection(db, "maps");
        let queryRef = query(
          collectionRef,
          where("visibility", "==", "public")
        );

        if (filter === "private" && deviceId) {
          queryRef = query(
            queryRef,
            where("link", "==", deviceId),
            where("visibility", "==", "private")
          );
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
