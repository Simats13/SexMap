import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useDeviceId } from "@/hooks/useDeviceId";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "expo-router";
import { RatingBar } from "@/components/atoms/RatingBar";
import { PinSkeleton } from "@/components/atoms/PinSkeleton";
import { Button } from "@/components/atoms/Button";

interface Pin {
  id: string;
  date: Date;
  locationName?: string;
  rating?: number;
  visibility: "public" | "private" | "friends";
  name?: string;
}

export default function Social() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { data: user } = useAuth();
  const { deviceId } = useDeviceId();
  const router = useRouter();

  const getDisplayName = async (userId: string) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.data()?.display_name;
  };

  const fetchPins = async () => {
    try {
      const pinsRef = collection(db, "maps");
      const userDoc = await getDoc(doc(db, "users", user?.uid || ""));
      const friendsList = userDoc.data()?.friendsList || [];

      const personalQuery = query(
        pinsRef,
        where("link", "in", [deviceId, user?.uid || ""]),
        where("visibility", "in", ["private", "public", "friends"])
      );

      const [personalSnap, friendsSnap] = await Promise.all([
        getDocs(personalQuery),
        friendsList.length > 0
          ? getDocs(
              query(
                pinsRef,
                where("userId", "in", friendsList),
                where("visibility", "in", ["public", "friends"])
              )
            )
          : getDocs(query(pinsRef, where("visibility", "==", "public")))
      ]);

      const allPins = await Promise.all(
        [...new Set([...personalSnap.docs, ...friendsSnap.docs].map(doc => doc.id))]
          .map(async (docId) => {
            const doc = [...personalSnap.docs, ...friendsSnap.docs].find(d => d.id === docId);
            if (!doc) return null;
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              date: data.date.toDate(),
              name: await getDisplayName(data.userId),
              visibility: data.visibility,
            } as Pin;
          })
      ).then(pins => pins.filter((pin): pin is Pin => pin !== null));

      setPins(allPins.sort((a, b) => b.date.getTime() - a.date.getTime()));
    } catch (error) {
      console.error("Erreur lors de la récupération des pins:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPins();
    setRefreshing(false);
  };

  const onEndReached = () => {
    if (!refreshing) {
      onRefresh();
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchPins();
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadInitialData();
    } else {
      setLoading(false);
    }
  }, [deviceId, user]);

  console.log("pins", pins);

  const renderItem = ({ item }: { item: Pin }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 bg-white mb-2 rounded-lg shadow-sm"
      onPress={() => router.push(`/modals/showSex?id=${item.id}`)}
    >
      <View className="flex-1">
        {item.name && (
          <Text className="text-gray-800 font-medium mb-1">{item.name}</Text>
        )}
        <Text className="text-gray-800 font-medium mb-1">
          {format(item.date, "d MMMM yyyy", { locale: fr })}
        </Text>
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="map-marker"
            size={16}
            color="#666"
            style={{ marginRight: 4 }}
          />
          <Text className="text-gray-600">
            {item.locationName || "Sans lieu"}
          </Text>
        </View>
        {item.rating && (
          <View className="mt-1">
            <RatingBar rating={item.rating} size={16} />
          </View>
        )}
      </View>
      <View className="flex-row items-center">
        <MaterialCommunityIcons
          name={
            item.visibility === "private"
              ? "lock"
              : item.visibility === "friends"
              ? "account-group"
              : "earth"
          }
          size={20}
          color="#666"
          style={{ marginRight: 8 }}
        />
        <Feather name="chevron-right" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  const handlePinAdded = (newPin: Pin) => {
    setPins((prev) =>
      [...prev, newPin].sort((a, b) => b.date.getTime() - a.date.getTime())
    );
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-gray-500 text-center mb-4">
          Connecte-toi pour voir les SexPins de tes amis
        </Text>
        <Button
          title="Se connecter"
          onPress={() => router.push("/modals/auth")}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 bg-gray-100 p-4">
        {[...Array(5)].map((_, index) => (
          <PinSkeleton key={index} />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={pins}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          flexGrow: pins.length === 0 ? 1 : undefined,
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-800 mb-4 text-center">
              Aucun SexPin pour le moment
            </Text>
            <Button
              title="Ajouter un SexPin"
              onPress={() => router.push("/modals/addSex")}
            />
          </View>
        }
      />
    </View>
  );
}
