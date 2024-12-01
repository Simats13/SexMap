import {
  collection,
  onSnapshot,
  GeoPoint,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useEffect, useState } from "react";

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface Pin {
  id: string;
  title?: string;
  location: GeoPoint;
  description?: string;
  rating?: number;
  createdAt: Date;
  userId?: string;
}

const RADIUS = 0.2;

export const usePins = (region?: MapRegion) => {
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    if (!region) return;

    // Requête simple pour récupérer tous les pins et filtrer côté client
    const unsubscribe = onSnapshot(collection(db, "maps"), (snapshot) => {
      const newPins = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            location: data.location,
            description: data.description,
            rating: data.rating,
            createdAt: data.createdAt?.toDate(),
            userId: data.userId,
          } as Pin;
        })
        .filter((pin) => {
          // Filtre par distance
          const latDiff = Math.abs(pin.location.latitude - region.latitude);
          const lonDiff = Math.abs(pin.location.longitude - region.longitude);
          return latDiff <= RADIUS && lonDiff <= RADIUS;
        });

      setPins(newPins);
    });

    return () => unsubscribe();
  }, [region]);

  return {
    data: pins,
    isLoading: false,
  };
};
