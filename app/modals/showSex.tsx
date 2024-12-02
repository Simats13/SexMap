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
  name?: string;
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

      const getDisplayName = async (userId: string) => {
        const userDoc = await getDoc(doc(db, "users", userId));
        return userDoc.data()?.display_name;
      };

      const displayName = await getDisplayName(data.userId);

      return {
        id: docSnap.id,
        title: data.title,
        location: data.location,
        createdAt: data.date.toDate(),
        userId: data.userId,
        description: data.description,
        partners: data.partners,
        rating: data.rating,
        name: displayName,
      };
    },
  });

  if (isLoading || !pin) return null;

  return <ShowSexTemplate pin={pin} />;
}
