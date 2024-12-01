import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { ShowSexTemplate } from "@/components/templates/ShowSexTemplate";

interface Pin {
  id: string;
  title: string;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  userId: string;
  description?: string;
  partner?: string;
  rating?: number;
}

export default function ShowSexModal() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: pin, isLoading } = useQuery<Pin>({
    queryKey: ["pin", id],
    queryFn: async () => {
      const docRef = doc(db, "maps", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Pin not found");
      const data = docSnap.data();

      let createdAt = new Date();
      try {
        createdAt = data.createdAt?.toDate() || new Date();
      } catch (error) {
        console.error('Invalid date:', error);
      }

      return {
        id: docSnap.id,
        title: data.title,
        location: data.location,
        createdAt,
        userId: data.userId,
        description: data.description,
        partner: data.partner,
        rating: data.rating,
      };
    },
  });

  if (isLoading || !pin) return null;

  return <ShowSexTemplate pin={pin} />;
} 