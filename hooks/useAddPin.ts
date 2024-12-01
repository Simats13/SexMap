import { useState } from "react";
import { useAuth } from "./useAuth";
import { useDeviceId } from "./useDeviceId";
import { db } from "@/config/firebase";
import { addDoc, collection, GeoPoint } from "firebase/firestore";
import { useRouter } from "expo-router";
import { useQueryClient } from '@tanstack/react-query';

interface AddPinParams {
  date: Date;
  description?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  locationName?: string;
  rating?: number;
  visibility: "public" | "private" | "friends";
  partners?: string[];
  anonym?: boolean;
}

export const useAddPin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useAuth();
  const { deviceId } = useDeviceId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const addPin = async (params: AddPinParams) => {
    try {
      setLoading(true);
      setError(null);

      const pinData = user
        ? {
            // Données pour utilisateur connecté
            anonym: params.anonym || false,
            date: params.date,
            description: params.description,
            likes: [],
            link: deviceId,
            location: new GeoPoint(params.location.latitude, params.location.longitude),
            locationName: params.locationName,
            partners: params.partners || [],
            rating: params.rating,
            visibility: params.visibility,
            userId: user.uid,
          }
        : {
            // Données pour utilisateur non connecté
            date: params.date,
            description: params.description,
            link: deviceId,
            location: new GeoPoint(params.location.latitude, params.location.longitude),
            rating: params.rating,
            visibility: params.visibility,
          };

      await addDoc(collection(db, "maps"), pinData);
      await queryClient.invalidateQueries({ queryKey: ["pins"] });
      router.back();
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du pin:", error);
      setError("Une erreur est survenue lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return {
    addPin,
    loading,
    error,
  };
};
