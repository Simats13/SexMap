import { useState } from "react";
import { useAuth } from "./useAuth";
import { useDeviceId } from "./useDeviceId";
import { db } from "@/config/firebase";
import { addDoc, collection, GeoPoint, getDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { usePushNotification } from "./usePushNotification";
import { Pin } from "./usePins";

export interface AddPinParams {
  date: Date;
  description: string;
  location: { latitude: number; longitude: number };
  rating: number;
  visibility: "public" | "private" | "friends";
  anonym: boolean;
  partners: string[];
  locationName: string;
  solo: boolean;
}

interface UserData {
  friendsList?: string[];
  display_name?: string;
}

export const useAddPin = (onPinAdded?: (newPin: Pin) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useAuth();
  const { deviceId } = useDeviceId();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { sendPushNotification } = usePushNotification(user?.uid);

  const notifyFriends = async (userId: string) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data() as UserData;
    const friendsList = userData.friendsList || [];
    const senderName = userData.display_name || "Un utilisateur";

    await sendPushNotification(
      friendsList,
      "Nouveau pin ajouté !",
      [
        `${senderName} vient de s'envoyer en l'air !`,
        `${senderName} est arrivé(e) au 7e ciel !`,
        `${senderName} a fait tutu-panpan !`,
        `${senderName} vient de tremper le biscuit !`,
        `${senderName} a fait coulisser l'andouillette dans le cresson !`,
        `${senderName} vient de mettre le petit Jésus dans la crèche !`,
        `${senderName} a cassé les lattes du lit !`,
        `${senderName} a fait baver la limace !`,
        `${senderName} vient de grimper aux rideaux !`,
        `${senderName} s'est fait refaire la tuyauterie !`,
        `Puceau.elle ? ${senderName} ? Sérieusement ? Haha ^^`,
        `${senderName} s'est fait dégorger le poireau !`,
        `${senderName} s'est fait casser les pattes arrières !`,
        `${senderName} vient d'envoyer la sauce !`,
        `${senderName} a tapé dans le fond ! Et c'était pas avec sa mère !`,
        `Baisse ta culotte, c'est ${senderName} qui pilote !`,
        `${senderName} vient de tirer son coup !`,
        `Cachez-vous ! ${senderName} a sorti sa 3e jambe !`,
        `${senderName} vient de tremper la nouille !`,
        `${senderName} a la rosée qui perle !`,
        `${senderName} a la Garonne en crue !`,
        `${senderName} vient de rentrer la voiture au garage !`,
        `${senderName} a fait visiter sa Bat Cave !`,
        `${senderName} vient de croquer la pomme !`,
        `${senderName} s'est ébouriffé le chignon !`,
        `${senderName} s'est fait incendier la chambre froide !`,
        `${senderName} vient de se faire galvaniser les escalopes !`,
        `${senderName} s'est fait dégivrer le congélo !`,
        `${senderName} vient de remplir le siphon de la douche !`,
        `${senderName} a mis le métro dans le tunnel !`,
        `${senderName} vient de prendre sa pétée !`,
        `${senderName} s'est fait gratiner les fesses !`,
      ][Math.floor(Math.random() * 32)],
      { type: "newPin" }
    );
  };

  const addPin = async (params: AddPinParams) => {
    try {
      setLoading(true);
      setError(null);

      const pinData = user
        ? {
            solo: params.solo,
            anonym: params.anonym || false,
            date: params.date,
            description: params.description,
            likes: [],
            link: deviceId,
            location: new GeoPoint(
              params.location.latitude,
              params.location.longitude
            ),
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
            location: new GeoPoint(
              params.location.latitude,
              params.location.longitude
            ),
            rating: params.rating,
            visibility: params.visibility,
          };

      const docRef = await addDoc(collection(db, "maps"), pinData);

      const newPin: Pin = {
        id: docRef.id,
        location: {
          latitude: params.location.latitude,
          longitude: params.location.longitude,
        },
        description: params.description,
        rating: params.rating,
        createdAt: params.date,
        userId: user?.uid,
        visibility: params.visibility,
      };

      onPinAdded?.(newPin);

      // Envoyer les notifications si l'utilisateur est connecté et que le pin n'est pas anonyme
      if (user && !params.anonym && params.visibility !== "private") {
        await notifyFriends(user.uid);
      }

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
