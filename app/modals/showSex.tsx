import { useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { ShowSexTemplate } from "@/components/templates/ShowSexTemplate";
import { useAuth } from "@/hooks/useAuth";
import { usePushNotification } from "@/hooks/usePushNotification";
import { Share } from "react-native";

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
  solo: boolean;
  like: string[];
}

export default function ShowSexModal() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: user } = useAuth();
  const queryClient = useQueryClient();

  const { sendPushNotification } = usePushNotification(user?.uid);

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
        solo: data.solo,
        like: data.like,
      };
    },
  });

  if (isLoading || !pin || !user) return null;

  const addLike = async (id: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "maps", id), {
        like: arrayUnion(user.uid),
      });
      await queryClient.invalidateQueries({ queryKey: ["pin", id] });
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  };

  const removeLike = async (id: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "maps", id), {
        like: arrayRemove(user.uid),
      });
      await queryClient.invalidateQueries({ queryKey: ["pin", id] });
    } catch (error) {
      console.error("Erreur lors du unlike:", error);
    }
  };

  const onShare = () => {
    try {
      Share.share({
        message: `Hey, j'ai trouvé ce SexPin sur SexMap : sexmap://pin/${id}`,
      });
    } catch (error) {
      console.error("Erreur lors du share:", error);
    }
  };

  const onLike = async () => {
    if (!user) return;
    try {
      if (pin.like?.includes(user.uid)) {
        await removeLike(id);
      } else {
        await addLike(id);
        if (pin.userId && pin.userId !== user.uid) {
          await sendPushNotification(
            [pin.userId],
            "Nouveau like",
            `${user.displayName} a liké votre pin`
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors du like/unlike:", error);
    }
  };

  return (
    <ShowSexTemplate user={user} pin={pin} onShare={onShare} onLike={onLike} />
  );
}
