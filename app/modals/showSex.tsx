import { useLocalSearchParams, useRouter } from "expo-router";
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
import { Share, View, ScrollView } from "react-native";

interface Pin {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  date: Date;
  link: string;
  rating: number;
  solo: boolean;
  likes: string[];
  userId?: string;
  description?: string;
  partners?: string[];
  locationName?: string;
}

export default function ShowSexModal() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: user } = useAuth();
  const queryClient = useQueryClient();

  const { sendPushNotification } = usePushNotification(user?.uid);
  const router = useRouter();
  const {
    data: pin,
    isLoading,
    error,
  } = useQuery<Pin>({
    queryKey: ["pin", id],
    queryFn: async () => {
      console.log("Début de queryFn avec id:", id);

      if (!id) {
        console.error("ID manquant");
        throw new Error("ID is required");
      }

      const docRef = doc(db, "maps", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Pin not found");
      }

      const data = docSnap.data();

      const getDisplayName = async (userId: string) => {
        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          const displayName =
            userDoc.data()?.display_name || "Utilisateur inconnu";
          console.log("DisplayName récupéré:", displayName);
          return displayName;
        } catch (error) {
          console.error(
            "Erreur lors de la récupération du nom d'utilisateur:",
            error
          );
          return "Utilisateur inconnu";
        }
      };

      const displayName = await getDisplayName(data.userId);

      const formattedPin = {
        id: docSnap.id,
        location: {
          latitude: data.location.latitude || 0,
          longitude: data.location.longitude || 0,
        },
        date: data.date?.toDate() || new Date(),
        userId: data.userId || "",
        description: data.description || "",
        partners: Array.isArray(data.partners)
          ? data.partners
          : data.partners
          ? [data.partners]
          : [],
        rating: data.rating || 1,
        solo: !!data.solo,
        likes: data.likes || [],
        link: data.link || "",
        name: displayName || "Utilisateur inconnu",
        locationName: data.locationName || "",
      };

      return formattedPin;
    },
    enabled: !!id,
    retry: 1,
  });

  if (error) {
    console.error("Erreur lors du chargement du pin:", error);
    return null;
  }

  if (isLoading)
    return (
      <View className="flex-1 bg-white">
        {/* Header avec boutons share et like */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <View className="h-6 w-1/3 bg-gray-200 rounded-full" />
          <View className="flex-row items-center">
            <View className="h-6 w-6 bg-gray-200 rounded-full mr-4" />
            <View className="h-6 w-6 bg-gray-200 rounded-full" />
          </View>
        </View>

        <ScrollView className="flex-1">
          <View className="p-4">
            <View className="mb-8 bg-white rounded-xl shadow-md p-4">
              {/* Nom */}
              <View className="h-6 w-3/4 bg-gray-200 rounded-full mb-6" />

              {/* Localisation */}
              <View className="h-6 w-1/3 bg-gray-200 rounded-full mb-2" />
              <View className="h-4 w-2/3 bg-gray-200 rounded-full mb-4" />

              {/* Map placeholder */}
              <View className="h-40 bg-gray-200 rounded-lg mb-4" />

              {/* Type (solo/duo) */}
              <View className="flex-row items-center mb-4">
                <View className="h-4 w-4 bg-gray-200 rounded-full mr-2" />
                <View className="h-4 w-2/3 bg-gray-200 rounded-full" />
              </View>

              {/* Date */}
              <View className="flex-row items-center mb-2">
                <View className="h-5 w-5 bg-gray-200 rounded-full mr-2" />
                <View className="h-5 w-1/3 bg-gray-200 rounded-full" />
              </View>
              <View className="h-4 w-1/2 bg-gray-200 rounded-full mb-4" />

              {/* Description */}
              <View className="flex-row items-center mb-2">
                <View className="h-5 w-5 bg-gray-200 rounded-full mr-2" />
                <View className="h-5 w-1/3 bg-gray-200 rounded-full" />
              </View>
              <View className="space-y-2 mb-4">
                <View className="h-4 w-full bg-gray-200 rounded-full" />
                <View className="h-4 w-5/6 bg-gray-200 rounded-full" />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );

  if (!pin) return null;

  const addLike = async (id: string) => {
    try {
      await updateDoc(doc(db, "maps", id), {
        likes: arrayUnion(user?.uid),
      });
      await queryClient.invalidateQueries({ queryKey: ["pin", id] });
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  };

  const removeLike = async (id: string) => {
    try {
      await updateDoc(doc(db, "maps", id), {
        like: arrayRemove(user?.uid),
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
    if (!user) return router.push("/modals/auth");

    try {
      if (pin.likes.includes(user.uid)) {
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
    <ShowSexTemplate
      user={user!!}
      pin={pin}
      onShare={onShare}
      onLike={onLike}
    />
  );
}
